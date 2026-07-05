// ── TaskDialog — Reusable task create / edit / view dialog ──────────
//
// Pure UI component — all data flows in via props.  No GraphQL, no
// routing, no side effects.  The host app owns the submit/delete logic.

import React, { useState, useEffect, useCallback } from 'react';
import {
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
  MenuItem,
  Select,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import { Edit, Label } from '@mui/icons-material';
import { RichTextEditor } from '../RichTextEditor';
import type { TaskDialogProps, TaskData, TaskStatus } from './types';

// ── Constants ───────────────────────────────────────────────────────

const STATUSES: TaskStatus[] = ['Backlog', 'In Progress', 'Reviewing', 'Finished'];

const STATUS_COLOUR: Record<TaskStatus, string> = {
  Backlog: '#9e9e9e',
  'In Progress': '#2196f3',
  Reviewing: '#ff9800',
  Finished: '#4caf50',
};

const emptyTask = (): TaskData => ({
  title: '',
  description: '',
  status: 'Backlog' as TaskStatus,
  startDate: '',
  endDate: '',
});

/** Derive the dialog label from `mode` and whether data is present. */
function dialogTitle(mode: TaskDialogProps['mode'], hasId: boolean): string {
  if (mode === 'create') return 'New Task';
  if (mode === 'edit') return 'Edit Task';
  // view
  return hasId ? 'Task Details' : 'Task';
}

// ── Default date field (native <input type="date"> via MUI TextField) ─

const DefaultDateField: React.FC<{
  label: string;
  value?: string;
  onChange: (iso: string) => void;
}> = ({ label, value, onChange }) => (
  <TextField
    size="small"
    type="date"
    label={label}
    value={value ?? ''}
    onChange={(e) => onChange(e.target.value)}
    InputLabelProps={{ shrink: true }}
  />
);

// ── Component ───────────────────────────────────────────────────────

export const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  onClose,
  task: taskProp,
  mode: modeProp,
  onSubmit,
  onDelete,
  title: titleOverride,
  renderHeaderActions,
  renderExtraFields,
  renderDateField,
}) => {
  // ── Derived state ───────────────────────────────────────────────

  const hasId = taskProp != null && Object.keys(taskProp).length > 0;
  const [mode, setMode] = useState<'create' | 'edit' | 'view'>(
    modeProp ?? (hasId ? 'view' : 'create'),
  );
  const [task, setTask] = useState<TaskData>(taskProp ?? emptyTask());
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Sync external task data when the prop changes (e.g. opening for a
  // different task).
  useEffect(() => {
    const next = taskProp ?? emptyTask();
    setTask(next);
    setMode(modeProp ?? (Object.keys(next).length > 0 && next.title ? 'view' : 'create'));
  }, [taskProp, modeProp]);

  // Reset local state when the dialog opens.
  useEffect(() => {
    if (open) {
      const next = taskProp ?? emptyTask();
      setTask(next);
      setMode(modeProp ?? (Object.keys(next).length > 0 && next.title ? 'view' : 'create'));
      setSubmitting(false);
      setDeleting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ── Handlers ────────────────────────────────────────────────────

  const handleField = useCallback(
    <K extends keyof TaskData>(key: K, value: TaskData[K]) =>
      setTask((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const handleSubmit = async () => {
    if (!onSubmit) return;
    setSubmitting(true);
    try {
      await onSubmit(task);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete();
    } finally {
      setDeleting(false);
    }
  };

  const editing = mode === 'create' || mode === 'edit';

  // ── Render ──────────────────────────────────────────────────────

  return (
    <Dialog maxWidth="md" fullWidth onClose={onClose} open={open}>
      {/* ── Title bar ──────────────────────────────────────────── */}
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {titleOverride ?? dialogTitle(mode, hasId)}
          </Typography>
          {renderHeaderActions?.()}
        </Box>
      </DialogTitle>
      <Divider />

      {/* ── Body ───────────────────────────────────────────────── */}
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2, pb: 1 }}
      >
        {/* Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {editing ? (
            <TextField
              label="Title"
              fullWidth
              size="small"
              value={task.title ?? ''}
              onChange={(e) => handleField('title', e.target.value)}
              InputProps={{
                startAdornment: <Label sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          ) : (
            <>
              <Typography variant="h5" fontWeight="bold">
                {task.title || '(Untitled)'}
              </Typography>
              {hasId && (
                <IconButton
                  size="small"
                  onClick={() => setMode('edit')}
                  color="primary"
                >
                  <Edit fontSize="small" />
                </IconButton>
              )}
            </>
          )}
        </Box>

        {/* Description */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Description
            </Typography>
            {!editing && hasId && (
              <IconButton
                size="small"
                onClick={() => setMode('edit')}
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
            onChange={(html) => handleField('description', html)}
            placeholder="Add a description…"
            minHeight={200}
          />
        </Box>

        {/* Status */}
        <Box>
          {editing ? (
            <Select
              size="small"
              value={task.status ?? 'Backlog'}
              onChange={(e: SelectChangeEvent) =>
                handleField('status', e.target.value as TaskStatus)
              }
              fullWidth
            >
              {STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <>
              <Typography variant="caption" color="text.secondary">
                Status
              </Typography>
              <Box sx={{ mt: 0.25 }}>
                <Chip
                  label={task.status ?? '—'}
                  size="small"
                  sx={{
                    bgcolor: STATUS_COLOUR[task.status as TaskStatus] ?? '#9e9e9e',
                    color: 'white',
                  }}
                />
              </Box>
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
            renderDateField ? (
              <>
                {renderDateField({
                  label: 'Start Date',
                  value: task.startDate,
                  onChange: (v) => handleField('startDate', v),
                  editable: editing,
                })}
                {renderDateField({
                  label: 'End Date',
                  value: task.endDate,
                  onChange: (v) => handleField('endDate', v),
                  editable: editing,
                })}
              </>
            ) : (
              <>
                <DefaultDateField
                  label="Start Date"
                  value={task.startDate}
                  onChange={(v) => handleField('startDate', v)}
                />
                <DefaultDateField
                  label="End Date"
                  value={task.endDate}
                  onChange={(v) => handleField('endDate', v)}
                />
              </>
            )
          ) : (
            <>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Start Date
                </Typography>
                <Typography variant="body2">{task.startDate || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  End Date
                </Typography>
                <Typography variant="body2">{task.endDate || '—'}</Typography>
              </Box>
            </>
          )}
        </Box>

        {/* App-specific extra fields */}
        {renderExtraFields?.(editing)}
      </DialogContent>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          display: 'flex',
          justifyContent: hasId && onDelete ? 'space-between' : 'flex-end',
        }}
      >
        {hasId && onDelete && (
          <Button
            onClick={handleDelete}
            disabled={deleting}
            variant="contained"
            color="error"
            size="small"
          >
            {deleting ? <CircularProgress size={18} /> : 'Delete'}
          </Button>
        )}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose} size="small">
            {editing ? 'Cancel' : 'Close'}
          </Button>
          {editing && onSubmit && (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              color="primary"
              variant="contained"
              size="small"
            >
              {submitting ? (
                <CircularProgress size={18} sx={{ mr: 0.5 }} />
              ) : null}
              {mode === 'create' ? 'Create' : 'Save'}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};
