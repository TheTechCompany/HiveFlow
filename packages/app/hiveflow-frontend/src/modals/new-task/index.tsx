import React, { useEffect, useState } from 'react';
import {
  Add,
  Close,
  Edit,
  Label,
} from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { FormControl } from '@hexhive/ui';
import { RichTextEditor } from '@hive-flow/ui';
import { MemberList } from './members';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';

// ── Types ───────────────────────────────────────────────────────────

interface TaskModalProps {
  open: boolean;
  selected?: any;
  users?: Array<{ id: string; name: string }>;
  /** When provided, shows a project autocomplete (for templates / unanchored tasks) */
  projects?: Array<{ id: string; displayId: string; name: string }>;
  skills?: Array<{ id: string; skill: string }>;
  /** Pre-fill parentId when creating a new subtask */
  initialParentId?: string;
  onClose: () => void;
  onSubmit?: (task: any) => Promise<void>;
  onDelete?: () => Promise<void>;
  /** Called to quickly create a subtask with just a title */
  onAddSubtask?: (parentId: string, title: string) => Promise<void>;
  /** Called when description changes from a checklist toggle — auto-saves immediately */
  onAutoSaveDescription?: (html: string) => void;
}

interface TaskState {
  title?: string;
  description?: string;
  status?: string;
  projectId?: string;
  parentId?: string;
  members?: string[];
  requiredSkills?: Array<{ skill?: string; hours?: string }>;
  startDate?: Date;
  endDate?: Date;
  dependencyOn?: Array<{ title: string; status: string; endDate: Date }>;
  dependencyOf?: Array<{ title: string; status: string; endDate: Date }>;
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
        onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
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

export const TaskModal: React.FC<TaskModalProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editing, setEditing] = useState(!props.selected?.id);

  const [task, setTask] = useState<TaskState>({
    status: 'Backlog',
    startDate: new Date(),
    endDate: new Date(),
  });

  useEffect(() => {
    const hasId = !!props.selected?.id;
    setEditing(!hasId);
    setTask({
      status: 'Backlog',
      startDate: new Date(),
      endDate: new Date(),
      parentId: props.initialParentId ?? undefined,
      ...props.selected,
      projectId: props.selected?.projectId ?? undefined,      members: props.selected?.members?.map((x: any) => x.id),
      dependencyOn: props.selected?.dependencyOn ?? [],
      dependencyOf: props.selected?.dependencyOf ?? [],
    });
  }, [props.selected, props.initialParentId]);

  const onDelete = async () => {
    setDeleteLoading(true);
    try {
      await props.onDelete?.();
      setTask({ status: 'Backlog', startDate: new Date(), endDate: new Date() });
    } catch {
      // keep dialog open on failure
    } finally {
      setDeleteLoading(false);
    }
  };

  const submit = async () => {
    setLoading(true);
    try {
      await props.onSubmit?.(task);
      setTask({ status: 'Backlog', startDate: new Date(), endDate: new Date() });
    } catch {
      // keep dialog open on failure
    } finally {
      setLoading(false);
    }
  };

  const hasDependencies =
    (task.dependencyOn?.length ?? 0) > 0 ||
    (task.dependencyOf?.length ?? 0) > 0;

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      onClose={props.onClose}
      open={props.open}
      PaperProps={{ sx: { minHeight: '70vh' } }}
    >
      {/* ── Header ──────────────────────────────────────────────── */}
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {props.selected?.id
                ? editing
                  ? 'Edit Task'
                  : 'Task Details'
                : 'New Task'}
            </Typography>
          </Box>
          <MemberList
            editable={editing}
            data={props.users || []}
            members={
              props.users?.filter((a) => task.members?.indexOf(a.id) > -1) ?? []
            }
            onMembersChanged={(members) =>
              setTask({ ...task, members: members.map((x) => x.id) })
            }
          />
        </Box>
      </DialogTitle>
      <Divider />

      {/* ── Body ────────────────────────────────────────────────── */}
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2, pb: 1 }}>
        {/* Project selector — shown when projects list provided */}
        {props.projects && props.projects.length > 0 && (
          <Box>
            {editing ? (
              <Autocomplete
                size="small"
                options={props.projects}
                getOptionLabel={(opt) => `${opt.displayId} - ${opt.name}`}
                value={props.projects.find((p: any) => p.displayId === task.projectId) || null}
                onChange={(_, val: any) => setTask({ ...task, projectId: val?.displayId || '' })}
                isOptionEqualToValue={(opt: any, val: any) => opt.displayId === val.displayId}
                renderInput={(params) => <TextField {...params} label="Project" size="small" fullWidth />}
              />
            ) : task.projectId ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">Project</Typography>
                <Chip label={props.projects.find((p: any) => p.displayId === task.projectId)?.name ?? task.projectId} size="small" variant="outlined" />
              </Box>
            ) : null}
          </Box>
        )}

        {/* Title — with edit icon in view mode */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {editing ? (
            <TextField
              label="Title"
              fullWidth
              size="small"
              value={task.title ?? ''}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              InputProps={{
                startAdornment: <Label sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          ) : (
            <>
              <Typography variant="h5" fontWeight="bold">
                {task.title || '(Untitled)'}
              </Typography>
              {props.selected?.id && (
                <IconButton
                  size="small"
                  onClick={() => setEditing(true)}
                  color="primary"
                >
                  <Edit fontSize="small" />
                </IconButton>
              )}
            </>
          )}
        </Box>

        {/* Description — with edit icon in view mode */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Description
            </Typography>
            {!editing && props.selected?.id && (
              <IconButton
                size="small"
                onClick={() => setEditing(true)}
                color="primary"
                sx={{ p: 0.25 }}
              >
                <Edit sx={{ fontSize: 14 }} />
              </IconButton>
            )}
          </Box>
          <RichTextEditor
            editable={editing}
            value={task.description ?? ''}
            onChange={(html) =>
              setTask({ ...task, description: html })
            }
            onChecklistToggle={props.onAutoSaveDescription
              ? (ev) => {
                  setTask({ ...task, description: ev.html });
                  props.onAutoSaveDescription!(ev.html);
                }
              : undefined
            }
            placeholder="Add a description…"
            minHeight={200}
          />
        </Box>

        {/* Parent */}
        {props.selected?.parent && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">Parent:</Typography>
            <Chip
              label={props.selected.parent.title}
              size="small"
              variant="outlined"
            />
          </Box>
        )}

        {/* Children / subtasks */}
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: (props.selected?.children?.length ?? 0) > 0 ? 1 : 0 }}>
            <Typography variant="subtitle2">Subtasks</Typography>
          </Box>
          {(props.selected?.children?.length ?? 0) > 0 ? (
            <Stack spacing={0.5}>
              {props.selected.children.map((child: any) => (
                <Box key={child.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2">{child.title}</Typography>
                  <Chip
                    label={child.status || 'Backlog'}
                    size="small"
                    sx={{
                      fontSize: '0.65rem',
                      height: 20,
                      bgcolor:
                        child.status === 'Finished' ? '#4caf50' :
                        child.status === 'In Progress' ? '#2196f3' :
                        child.status === 'Reviewing' ? '#ff9800' :
                        '#9e9e9e',
                      color: 'white',
                    }}
                  />
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>No subtasks yet</Typography>
          )}
          {props.selected?.id && <SubtasksInput parentId={props.selected.id} onAdd={props.onAddSubtask} />}
        </Box>

        {/* Status */}
        <Box>
          {editing ? (
            <FormControl
              placeholder="Status"
              value={task.status}
              onChange={(val) => setTask({ ...task, status: val })}
              labelKey="label"
              valueKey="id"
              options={['Backlog', 'In Progress', 'Reviewing', 'Finished'].map(
                (x) => ({ id: x, label: x }),
              )}
            />
          ) : (
            <>
              <Typography variant="caption" color="text.secondary">
                Status
              </Typography>
              <Typography variant="body2">{task.status ?? '—'}</Typography>
            </>
          )}
        </Box>

        {/* Dates */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1.5,
          }}
        >
          {editing ? (
            <DatePicker
              format="DD/MM/YYYY"
              value={task.startDate ? moment(task.startDate) : null}
              onChange={(date) =>
                date && setTask({ ...task, startDate: date.toDate() })
              }
              slotProps={{ textField: { size: 'small', label: 'Start Date' } }}
            />
          ) : (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Start Date
              </Typography>
              <Typography variant="body2">
                {task.startDate
                  ? moment(task.startDate).format('DD/MM/YYYY')
                  : '—'}
              </Typography>
            </Box>
          )}
          {editing ? (
            <DatePicker
              format="DD/MM/YYYY"
              value={task.endDate ? moment(task.endDate) : null}
              onChange={(date) =>
                date && setTask({ ...task, endDate: date.toDate() })
              }
              slotProps={{ textField: { size: 'small', label: 'End Date' } }}
            />
          ) : (
            <Box>
              <Typography variant="caption" color="text.secondary">
                End Date
              </Typography>
              <Typography variant="body2">
                {task.endDate
                  ? moment(task.endDate).format('DD/MM/YYYY')
                  : '—'}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Dependencies info */}
        {hasDependencies && (
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
              {task.dependencyOn?.length ? (
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    gutterBottom
                  >
                    Needs
                  </Typography>
                  {task.dependencyOn
                    .filter((d) => d.status !== 'Finished')
                    .map((dep, i) => (
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
              {task.dependencyOf?.length ? (
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    gutterBottom
                  >
                    Needed by
                  </Typography>
                  {task.dependencyOf
                    .filter((d) => d.status !== 'Finished')
                    .map((dep, i) => (
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
        )}

        {/* Skills section */}
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
              <Typography variant="subtitle2">Required Skills</Typography>
              {editing && (
                <IconButton
                  size="small"
                  onClick={() =>
                    setTask({
                      ...task,
                      requiredSkills: [
                        ...(task.requiredSkills ?? []),
                        { skill: '', hours: '0' },
                      ],
                    })
                  }
                >
                  <Add fontSize="small" />
                </IconButton>
              )}
            </Box>
            {task.requiredSkills?.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No skills added yet{editing ? '. Click + to add one.' : '.'}
              </Typography>
            )}
            {task.requiredSkills?.map((skill, ix) => (
              <Box
                key={ix}
                sx={{
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                {editing ? (
                  <>
                    <Autocomplete
                      fullWidth
                      size="small"
                      value={skill.skill ?? ''}
                      onChange={(_e, newValue) => {
                        const skills = (task.requiredSkills ?? []).slice();
                        skills[ix] = { ...skills[ix], skill: newValue ?? '' };
                        setTask({ ...task, requiredSkills: skills });
                      }}
                      options={props.skills?.map((s) => s.skill) ?? []}
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Skill" />
                      )}
                    />
                    <TextField
                      size="small"
                      type="number"
                      label="Hours"
                      sx={{ width: 100 }}
                      value={skill.hours ?? ''}
                      onChange={(e) => {
                        const skills = (task.requiredSkills ?? []).slice();
                        skills[ix] = { ...skills[ix], hours: e.target.value };
                        setTask({ ...task, requiredSkills: skills });
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        const skills = (task.requiredSkills ?? []).slice();
                        skills.splice(ix, 1);
                        setTask({
                          ...task,
                          requiredSkills:
                            skills.length > 0 ? skills : undefined,
                        });
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </>
                ) : (
                  <Typography variant="body2">
                    {skill.skill || '(unnamed)'}
                    {skill.hours ? ` — ${skill.hours}h` : ''}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>

      </DialogContent>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          display: 'flex',
          justifyContent: props.selected?.id ? 'space-between' : 'flex-end',
        }}
      >
        {props.selected?.id && (
          <Button
            onClick={onDelete}
            disabled={deleteLoading}
            variant="contained"
            color="error"
            size="small"
          >
            {deleteLoading ? <CircularProgress size={18} /> : 'Delete'}
          </Button>
        )}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={props.onClose} size="small">
            {editing ? 'Cancel' : 'Close'}
          </Button>
          {editing && (
            <Button
              onClick={submit}
              disabled={loading}
              color="primary"
              variant="contained"
              size="small"
            >
              {loading ? (
                <CircularProgress size={18} sx={{ mr: 0.5 }} />
              ) : null}
              {props.selected?.id ? 'Save' : 'Create'}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};
