// ── HandoverDialog — Task-to-people handover sheet dialog ───────────
//
// Pure UI component — all data flows in via props.  No GraphQL, no
// routing, no side effects.  The host app owns the data-fetching and
// save/export logic.

import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Edit, PictureAsPdf } from '@mui/icons-material';
import type {
  HandoverDialogProps,
  HandoverTask,
  HandoverTaskStatus,
  HandoverAssignment,
} from './types';

// ── Constants ───────────────────────────────────────────────────────

const STATUS_COLOUR: Record<HandoverTaskStatus, string> = {
  Backlog: '#9e9e9e',
  'In Progress': '#2196f3',
  Reviewing: '#ff9800',
  Finished: '#4caf50',
};

// ── Helpers ─────────────────────────────────────────────────────────

function getAssignment(
  assignments: HandoverAssignment[],
  taskId: string,
): HandoverAssignment {
  return (
    assignments.find((a) => a.taskId === taskId) ?? { taskId, personIds: [] }
  );
}

const selectedIds = (tasks: HandoverTask[]) =>
  new Set(tasks.map((t) => t.id));

// ── Component ───────────────────────────────────────────────────────

export const HandoverDialog: React.FC<HandoverDialogProps> = ({
  open,
  onClose,
  date,
  handoverId,
  projects,
  selectedProjectId,
  onProjectChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  availableTasks,
  selectedTasks,
  onTasksChange,
  managers,
  onManagersChange,
  people,
  assignments,
  onAssignmentChange,
  comment,
  onCommentChange,
  extraPeople,
  onExtraPeopleChange,
  onExportPdf,
  onSubmit,
}) => {
  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  const [editingTasks, setEditingTasks] = useState(!handoverId);

  // Reset edit mode each time the dialog opens
  const prevOpenRef = useRef(false);
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      setEditingTasks(!handoverId);
    }
    prevOpenRef.current = open;
  }, [open, handoverId]);

  // ── Task checkbox handlers ────────────────────────────────────

  const handleToggleTask = (task: HandoverTask) => {
    const ids = selectedIds(selectedTasks);
    if (ids.has(task.id)) {
      onTasksChange(selectedTasks.filter((t) => t.id !== task.id));
      // Clear assignments for unchecked tasks
      onAssignmentChange({ taskId: task.id, personIds: [] });
    } else {
      onTasksChange([...selectedTasks, task]);
    }
  };

  const handleToggleAll = () => {
    if (selectedTasks.length === availableTasks.length) {
      onTasksChange([]);
    } else {
      onTasksChange([...availableTasks]);
    }
  };

  // ── Render ────────────────────────────────────────────────────

  const selIds = selectedIds(selectedTasks);
  const allChecked =
    availableTasks.length > 0 && selectedTasks.length === availableTasks.length;
  const someChecked =
    selectedTasks.length > 0 && selectedTasks.length < availableTasks.length;

  // People summary — computed at render level so it updates reliably
  const assignedIds = new Set(
    assignments.flatMap((a) => a.personIds),
  );
  const extraIds = new Set(extraPeople.map((p) => p.id));
  const allListedIds = new Set([...assignedIds, ...extraIds]);
  const assignedPeople = people.filter((p) => assignedIds.has(p.id));
  const availableForExtra = people.filter((p) => !allListedIds.has(p.id));
  const extraOnlyPeople = extraPeople.filter((p) => !assignedIds.has(p.id));

  return (
    <Dialog maxWidth="lg" fullWidth onClose={onClose} open={open}>
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight="bold">
          Handover{date ? ` — ${date}` : ''}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2 }}>
          <Autocomplete
            multiple
            size="small"
            options={people}
            value={managers}
            onChange={(_e, value) => onManagersChange(value)}
            getOptionLabel={(p) => p.name}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="+ Manager"
                size="small"
                sx={{
                  minWidth: 180,
                  '& .MuiInputBase-root': { fontSize: 13 },
                }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((p, ix) => (
                <Chip
                  key={p.id}
                  label={p.name}
                  size="small"
                  variant="outlined"
                  {...getTagProps({ index: ix })}
                />
              ))
            }
            sx={{ minWidth: 140 }}
          />
        </Box>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ pt: 2, pb: 1, minHeight: 300 }}>
        {/* Project */}
        <Box sx={{ mb: 1.5 }}>
          <Autocomplete
            fullWidth
            size="small"
            options={projects}
            value={selectedProject}
            onChange={(_e, value) => {
              if (value) onProjectChange(value.id);
            }}
            getOptionLabel={(p) => `${p.displayId} — ${p.name}`}
            renderInput={(params) => (
              <TextField {...params} label="Project" size="small" />
            )}
          />
        </Box>

        {/* Date range */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1.5,
            mb: 1.5,
          }}
        >
          <TextField
            size="small"
            type="date"
            label="Start Date"
            value={startDate ?? ''}
            onChange={(e) => onStartDateChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            size="small"
            type="date"
            label="End Date"
            value={endDate ?? ''}
            onChange={(e) => onEndDateChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        {/* Tasks */}
        {selectedProject && availableTasks.length > 0 && (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 0.5,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {editingTasks
                  ? `${selectedTasks.length} of ${availableTasks.length} tasks selected`
                  : `${selectedTasks.length} task${selectedTasks.length !== 1 ? 's' : ''}`}
              </Typography>
              <Button
                size="small"
                onClick={() => setEditingTasks((v) => !v)}
                startIcon={editingTasks ? undefined : <Edit sx={{ fontSize: 16 }} />}
                sx={{ textTransform: 'none', minWidth: 0 }}
              >
                {editingTasks ? 'Done' : 'Edit tasks'}
              </Button>
            </Box>

            <TableContainer sx={{ maxHeight: editingTasks ? 320 : undefined }}>
              <Table size="small" stickyHeader={editingTasks}>
                <TableHead>
                  <TableRow>
                    {editingTasks && (
                      <TableCell
                        padding="checkbox"
                        sx={{
                          fontWeight: 600,
                          bgcolor: 'secondary.main',
                          color: 'secondary.contrastText',
                        }}
                      >
                        <Checkbox
                          size="small"
                          checked={allChecked}
                          indeterminate={someChecked}
                          onChange={handleToggleAll}
                          sx={{ color: 'secondary.contrastText' }}
                        />
                      </TableCell>
                    )}
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        maxWidth: '34%',
                        bgcolor: 'secondary.main',
                        color: 'secondary.contrastText',
                      }}
                    >
                      Task
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        width: 110,
                        bgcolor: 'secondary.main',
                        color: 'secondary.contrastText',
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        minWidth: 280,
                        bgcolor: 'secondary.main',
                        color: 'secondary.contrastText',
                      }}
                    >
                      People
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(editingTasks ? availableTasks : selectedTasks).map((task) => {
                    const checked = selIds.has(task.id);
                    const assignment = getAssignment(assignments, task.id);

                    return (
                      <TableRow
                        key={task.id}
                        hover
                        sx={{
                          opacity: editingTasks && !checked ? 0.55 : 1,
                          transition: 'opacity 0.15s',
                        }}
                      >
                        {editingTasks && (
                          <TableCell padding="checkbox">
                            <Checkbox
                              size="small"
                              checked={checked}
                              onChange={() => handleToggleTask(task)}
                            />
                          </TableCell>
                        )}

                        <TableCell sx={{ maxWidth: '34%' }}>
                          <Typography
                            variant="body2"
                            fontWeight={500}
                          >
                            {task.title}
                          </Typography>
                          {task.description && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {task.description.replace(/<[^>]*>/g, '')}
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={task.status}
                            size="small"
                            sx={{
                              bgcolor:
                                STATUS_COLOUR[task.status] ?? '#9e9e9e',
                              color: 'white',
                              fontSize: 12,
                            }}
                          />
                        </TableCell>

                        <TableCell sx={{ minWidth: 280 }}>
                          {editingTasks && checked ? (
                            <Autocomplete
                              multiple
                              fullWidth
                              size="small"
                              options={people}
                              value={people.filter((p) =>
                                assignment.personIds.includes(p.id),
                              )}
                              getOptionLabel={(p) => p.name}
                              isOptionEqualToValue={(a, b) => a.id === b.id}
                              onChange={(_e, value) => {
                                onAssignmentChange({
                                  taskId: task.id,
                                  personIds: value.map((p) => p.id),
                                });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="+ Add"
                                  size="small"
                                  sx={{
                                    '& .MuiInputBase-root': { fontSize: 13 },
                                  }}
                                />
                              )}
                            />
                          ) : editingTasks ? (
                            <Typography variant="caption" color="text.disabled">
                              Tick to assign
                            </Typography>
                          ) : (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {assignment.personIds.length === 0 ? (
                                <Typography variant="caption" color="text.disabled">
                                  —
                                </Typography>
                              ) : (
                                assignment.personIds.map((pid) => {
                                  const person = people.find((p) => p.id === pid);
                                  return (
                                    <Chip
                                      key={pid}
                                      label={person?.name ?? pid}
                                      size="small"
                                      variant="outlined"
                                    />
                                  );
                                })
                              )}
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {selectedProject && availableTasks.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
              color: 'text.secondary',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              mb: 1.5,
            }}
          >
            <Typography variant="body2">
              No tasks available for this project.
            </Typography>
          </Box>
        )}

        {/* People summary — always visible */}
        <Box sx={{ mt: 1.5 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
            {assignedPeople.map((p) => {
              const taskCount = assignments.filter((a) =>
                a.personIds.includes(p.id),
              ).length;
              return (
                <Chip
                  key={p.id}
                  label={`${p.name}${taskCount > 1 ? ` · ${taskCount}` : ''}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  title={`Assigned to ${taskCount} task${taskCount > 1 ? 's' : ''}`}
                />
              );
            })}

            <Autocomplete
              multiple
              size="small"
              options={availableForExtra}
              value={extraOnlyPeople}
              getOptionLabel={(p) => p.name}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              onChange={(_e, value) => {
                onExtraPeopleChange(
                  value.filter((p) => !assignedIds.has(p.id)),
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={
                    assignedPeople.length + extraOnlyPeople.length > 0
                      ? '+ Add'
                      : 'People'
                  }
                  size="small"
                  sx={{
                    '& .MuiInputBase-root': { fontSize: 13 },
                    minWidth: 150,
                  }}
                />
              )}
              sx={{ minWidth: 160 }}
            />
          </Box>
        </Box>

        {/* Comment */}
        <Box sx={{ mt: 1.5 }}>
          <TextField
            fullWidth
            size="small"
            label="Comment"
            multiline
            minRows={2}
            maxRows={5}
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Add a general handover comment…"
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button
          onClick={onExportPdf}
          variant="outlined"
          size="small"
          startIcon={<PictureAsPdf />}
        >
          Export PDF
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose} size="small">
            Cancel
          </Button>
          {onSubmit && (
            <Button
              onClick={onSubmit}
              color="primary"
              variant="contained"
              size="small"
            >
              Save
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};
