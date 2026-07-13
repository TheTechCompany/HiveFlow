// ── TaskModal — Thin wrapper around @hive-flow/ui TaskDialog ────────
//
// Keeps the same exported name and props so no consumer changes are
// needed.  Internally delegates to TaskDialog with click-to-edit and
// optional expandable sidebar.  All domain-specific features (members,
// projects, skills, subtasks, dependencies, dates) are injected through
// render slots.

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Add,
  Close,
  ExpandLess,
  ExpandMore,
  MoreHoriz,
} from '@mui/icons-material';
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { FormControl } from '@hexhive/ui';
import { TaskDialog, type TaskData } from '@hive-flow/ui';
import { MemberList } from './members';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';

// ── Types ───────────────────────────────────────────────────────────

interface TaskModalProps {
  open: boolean;
  selected?: any;
  users?: Array<{ id: string; name: string }>;
  projects?: Array<{ id: string; displayId: string; name: string }>;
  skills?: Array<{ id: string; skill: string }>;
  initialParentId?: string;
  onClose: () => void;
  onSubmit?: (task: any) => Promise<void>;
  onDelete?: () => Promise<void>;
  onAddSubtask?: (parentId: string, title: string) => Promise<void>;
  onSelectTask?: (taskId: string) => void;
  onAutoSaveDescription?: (html: string) => void;
}

interface DomainState {
  projectId?: string;
  members?: string[];
  requiredSkills?: Array<{ skill?: string; hours?: string }>;
}

// ── Helpers ─────────────────────────────────────────────────────────

/** Extract TaskData fields from the app's raw task object. */
function toTaskData(selected: any): TaskData {
  if (!selected) return {};
  return {
    title: selected.title ?? '',
    description: selected.description ?? '',
    status: selected.status ?? 'Backlog',
    startDate: selected.startDate
      ? moment(selected.startDate).format('YYYY-MM-DD')
      : selected.start
        ? moment(selected.start).format('YYYY-MM-DD')
        : '',
    endDate: selected.endDate
      ? moment(selected.endDate).format('YYYY-MM-DD')
      : selected.end
        ? moment(selected.end).format('YYYY-MM-DD')
        : '',
  };
}

// ── Inline subtask adder ─────────────────────────────────────────

const SubtasksInput: React.FC<{
  parentId: string;
  onAdd?: (parentId: string, title: string) => Promise<void>;
}> = ({ parentId, onAdd }) => {
  const [title, setTitle] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    const trimmed = title.trim();
    if (!trimmed || !onAdd) return;
    setAdding(true);
    try {
      await onAdd(parentId, trimmed);
      setTitle('');
    } catch {
      // keep input on failure
    } finally {
      setAdding(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      <TextField
        size="small"
        fullWidth
        placeholder="Add subtask…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAdd();
        }}
        disabled={adding}
        inputProps={{ sx: { fontSize: '0.8rem', py: 0.5 } }}
      />
      <IconButton
        size="small"
        onClick={handleAdd}
        disabled={adding || !title.trim()}
        color="primary"
      >
        {adding ? <CircularProgress size={16} /> : <Add fontSize="small" />}
      </IconButton>
    </Box>
  );
};

// ── Component ───────────────────────────────────────────────────────

export const TaskModal: React.FC<TaskModalProps> = ({
  open,
  selected,
  users,
  projects,
  skills,
  initialParentId,
  onClose,
  onSubmit,
  onDelete,
  onAddSubtask,
  onSelectTask,
  onAutoSaveDescription,
}) => {
  // ── Domain state (not part of TaskData) ─────────────────────────
  const [domain, setDomain] = useState<DomainState>({});
  const [subtasksOpen, setSubtasksOpen] = useState(false);

  // "Add optional" dropdown
  const addOptionalRef = useRef<HTMLButtonElement>(null);
  const [addOptionalOpen, setAddOptionalOpen] = useState(false);
  const [datesEnabled, setDatesEnabled] = useState(false);

  // Sync domain state when selected changes.
  useEffect(() => {
    setDomain({
      projectId: selected?.projectId ?? undefined,
      members: selected?.members?.map((x: any) => x.id) ?? [],
      requiredSkills: selected?.requiredSkills ?? [],
    });
    setSubtasksOpen(false);
    // Auto-enable dates if the task already has them
    setDatesEnabled(!!selected?.startDate || !!selected?.endDate);
  }, [selected]);

  // ── Submit — merge TaskData + domain state ──────────────────────
  const handleSubmit = useCallback(
    async (taskData: TaskData) => {
      if (!onSubmit) return;
      const merged = {
        ...selected,
        ...taskData,
        ...domain,
        startDate: taskData.startDate
          ? moment(taskData.startDate).toDate()
          : undefined,
        endDate: taskData.endDate
          ? moment(taskData.endDate).toDate()
          : undefined,
      };
      await onSubmit(merged);
    },
    [onSubmit, selected, domain],
  );

  // ── Slots ───────────────────────────────────────────────────────

  const headerPrefix = selected?.parent ? (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
      <Typography
        variant="body2"
        onClick={() => onSelectTask?.(selected.parent.id)}
        sx={{
          color: 'primary.main',
          cursor: 'pointer',
          fontWeight: 500,
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        {selected.parent.title || '(Untitled)'}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mx: 0.25 }}>
        ›
      </Typography>
    </Box>
  ) : undefined;

  const renderHeaderActions = users
    ? () => (
        <MemberList
          data={users}
          members={users.filter((a) => domain.members?.includes(a.id)) ?? []}
          onMembersChanged={(members) =>
            setDomain((prev) => ({
              ...prev,
              members: members.map((x) => x.id),
            }))
          }
        />
      )
    : undefined;

  const renderExtraFields = (activeField: string | null) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Project selector */}
      {projects && projects.length > 0 && (
        <Box>
          <Autocomplete
            size="small"
            options={projects}
            getOptionLabel={(opt) => `${opt.displayId} - ${opt.name}`}
            value={
              projects.find((p: any) => p.displayId === domain.projectId) ??
              null
            }
            onChange={(_, val: any) =>
              setDomain((prev) => ({
                ...prev,
                projectId: val?.displayId || '',
              }))
            }
            isOptionEqualToValue={(opt: any, val: any) =>
              opt.displayId === val.displayId
            }
            renderInput={(params) => (
              <TextField {...params} label="Project" size="small" fullWidth />
            )}
          />
        </Box>
      )}

      {/* Time estimate — only show the full section when items exist */}
      {(domain.requiredSkills?.length ?? 0) > 0 ? (
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 1.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography variant="subtitle2">Time estimate</Typography>
            <IconButton
              size="small"
              onClick={() =>
                setDomain((prev) => ({
                  ...prev,
                  requiredSkills: [
                    ...(prev.requiredSkills ?? []),
                    { skill: '', hours: '0' },
                  ],
                }))
              }
            >
              <Add fontSize="small" />
            </IconButton>
          </Box>
          {domain.requiredSkills?.map((skill, ix) => (
            <Box
              key={ix}
              sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}
            >
              <Autocomplete
                fullWidth
                size="small"
                value={skill.skill ?? ''}
                onChange={(_e, newValue) => {
                  const arr = (domain.requiredSkills ?? []).slice();
                  arr[ix] = { ...arr[ix], skill: newValue ?? '' };
                  setDomain((prev) => ({ ...prev, requiredSkills: arr }));
                }}
                options={skills?.map((s) => s.skill) ?? []}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Task or activity" />
                )}
              />
              <TextField
                size="small"
                type="number"
                label="Hours"
                sx={{ width: 100 }}
                value={skill.hours ?? ''}
                onChange={(e) => {
                  const arr = (domain.requiredSkills ?? []).slice();
                  arr[ix] = { ...arr[ix], hours: e.target.value };
                  setDomain((prev) => ({ ...prev, requiredSkills: arr }));
                }}
              />
              <IconButton
                size="small"
                onClick={() => {
                  const arr = (domain.requiredSkills ?? []).slice();
                  arr.splice(ix, 1);
                  setDomain((prev) => ({
                    ...prev,
                    requiredSkills: arr.length > 0 ? arr : undefined,
                  }));
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      ) : null}

      {/* Add optional — dropdown for sections that start empty */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          ref={addOptionalRef}
          size="small"
          variant="text"
          startIcon={<MoreHoriz />}
          onClick={() => setAddOptionalOpen(true)}
          sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
        >
          Add optional
        </Button>
        <Menu
          anchorEl={addOptionalRef.current}
          open={addOptionalOpen}
          onClose={() => setAddOptionalOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem
            dense
            onClick={() => {
              setDomain((prev) => ({
                ...prev,
                requiredSkills: [
                  ...(prev.requiredSkills ?? []),
                  { skill: '', hours: '0' },
                ],
              }));
              setAddOptionalOpen(false);
            }}
          >
            Time estimate
          </MenuItem>
          {!datesEnabled && (
            <MenuItem
              dense
              onClick={() => {
                setDatesEnabled(true);
                setAddOptionalOpen(false);
              }}
            >
              Dates
            </MenuItem>
          )}
        </Menu>
      </Box>
    </Box>
  );

  const renderSubtasks =
    selected?.id && (selected?.children || onAddSubtask)
      ? () => (
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 1.5,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
              onClick={() => setSubtasksOpen(!subtasksOpen)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="subtitle2">Subtasks</Typography>
                <Chip
                  label={selected?.children?.length ?? 0}
                  size="small"
                  sx={{ height: 18, fontSize: '0.65rem' }}
                />
              </Box>
              <IconButton size="small" sx={{ p: 0 }}>
                {subtasksOpen ? (
                  <ExpandLess fontSize="small" />
                ) : (
                  <ExpandMore fontSize="small" />
                )}
              </IconButton>
            </Box>
            {subtasksOpen && (
              <>
                {(selected?.children?.length ?? 0) > 0 ? (
                  <Stack spacing={0.5} sx={{ mt: 1 }}>
                    {selected.children.map((child: any) => (
                      <Box
                        key={child.id}
                        onClick={() => onSelectTask?.(child.id)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <Typography variant="body2">{child.title}</Typography>
                        <Chip
                          label={child.status || 'Backlog'}
                          size="small"
                          sx={{
                            fontSize: '0.65rem',
                            height: 20,
                            bgcolor:
                              child.status === 'Finished'
                                ? '#4caf50'
                                : child.status === 'In Progress'
                                  ? '#2196f3'
                                  : child.status === 'Reviewing'
                                    ? '#ff9800'
                                    : '#9e9e9e',
                            color: 'white',
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    No subtasks yet
                  </Typography>
                )}
                {selected?.id && (
                  <Box sx={{ mt: 1 }}>
                    <SubtasksInput
                      parentId={selected.id}
                      onAdd={onAddSubtask}
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        )
      : undefined;

  const hasDependencies =
    (selected?.dependencyOn?.length ?? 0) > 0 ||
    (selected?.dependencyOf?.length ?? 0) > 0;

  const renderDependencies = hasDependencies
    ? () => (
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 1.5,
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Dependencies
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {selected?.dependencyOn?.length ? (
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Needs
                </Typography>
                {selected.dependencyOn
                  .filter((d: any) => d.status !== 'Finished')
                  .map((dep: any, i: number) => (
                    <Chip
                      key={i}
                      size="small"
                      label={dep.title}
                      color={
                        new Date(dep.endDate).getTime() < Date.now()
                          ? 'error'
                          : 'default'
                      }
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
              </Box>
            ) : null}
            {selected?.dependencyOf?.length ? (
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Needed by
                </Typography>
                {selected.dependencyOf
                  .filter((d: any) => d.status !== 'Finished')
                  .map((dep: any, i: number) => (
                    <Chip
                      key={i}
                      size="small"
                      label={dep.title}
                      color={
                        new Date(dep.endDate).getTime() < Date.now()
                          ? 'error'
                          : 'default'
                      }
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
              </Box>
            ) : null}
          </Box>
        </Box>
      )
    : undefined;

  const renderAfterStatus = selected?.createdBy
    ? () => (
        <Box>
          <Typography variant="caption" color="text.secondary">
            Created by
          </Typography>
          <Box
            sx={{
              mt: 0.25,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Chip
              avatar={
                <Avatar sx={{ width: 22, height: 22, fontSize: 11 }}>
                  {selected.createdBy.name?.[0]}
                </Avatar>
              }
              label={selected.createdBy.name}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>
      )
    : undefined;

  const renderDateField = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value?: string;
    onChange: (iso: string) => void;
    editable: boolean;
  }) => (
    <DatePicker
      format="DD/MM/YYYY"
      value={value ? moment(value) : null}
      onChange={(date) => {
        if (date) onChange(date.format('YYYY-MM-DD'));
      }}
      slotProps={{ textField: { size: 'small', label } }}
    />
  );

  // ── Render ───────────────────────────────────────────────────────

  return (
    <TaskDialog
      open={open}
      task={toTaskData(selected)}
      onClose={onClose}
      onSubmit={handleSubmit}
      onDelete={onDelete}
      headerPrefix={headerPrefix}
      renderHeaderActions={renderHeaderActions}
      renderExtraFields={renderExtraFields}
      renderSubtasks={renderSubtasks}
      renderDependencies={renderDependencies}
      renderDateField={renderDateField}
      renderAfterStatus={renderAfterStatus}
      hideDates={!datesEnabled}
      onChecklistToggle={
        onAutoSaveDescription
          ? (ev) => onAutoSaveDescription(ev.html)
          : undefined
      }
    />
  );
};
