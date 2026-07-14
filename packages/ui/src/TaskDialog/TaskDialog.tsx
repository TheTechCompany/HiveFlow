// ── TaskDialog — Reusable task create / edit / view dialog ──────────
//
// Click-to-edit: each field flips individually when clicked.  A "Save"
// button appears once anything is dirty.  An optional expandable sidebar
// provides Comments / Activity / People tabs without cluttering the form.
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
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import {
  ChatBubbleOutline,
  Edit,
  Label,
} from '@mui/icons-material';
import { RichTextEditor } from '../RichTextEditor';
import type { TaskDialogProps, TaskData, TaskStatus, SidebarTab } from './types';

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

/** Format an ISO date (YYYY-MM-DD) for display as dd/mm/yyyy. */
function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return '—';
  return `${d}/${m}/${y}`;
}

// ── Default date field (native <input type="date"> via MUI TextField) ─

const DefaultDateField: React.FC<{
  label: string;
  value?: string;
  onChange: (iso: string) => void;
  autoFocus?: boolean;
  onBlur?: () => void;
}> = ({ label, value, onChange, autoFocus, onBlur }) => (
  <TextField
    size="small"
    fullWidth
    type="date"
    label={label}
    autoFocus={autoFocus}
    value={value ?? ''}
    onChange={(e) => onChange(e.target.value)}
    onBlur={onBlur}
    InputLabelProps={{ shrink: true }}
  />
);

// ── Sidebar panel ───────────────────────────────────────────────────

const SidebarPanel: React.FC<{
  tabs: SidebarTab[];
}> = ({ tabs }) => {
  const [tab, setTab] = useState(0);

  return (
    <>
      <Divider orientation="vertical" flexItem />
      <Box
        sx={{
          flex: 2,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ px: 2, pt: 1 }}
        >
          {tabs.map((t, i) => (
            <Tab
              key={t.key}
              icon={t.icon}
              label={
                t.badge != null && t.badge > 0
                  ? `${t.label} (${t.badge})`
                  : t.label
              }
              iconPosition="start"
              sx={{ minHeight: 40, fontSize: '0.8rem' }}
            />
          ))}
        </Tabs>
        <Divider />
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {tabs[tab]?.content}
        </Box>
      </Box>
    </>
  );
};

// ── Component ───────────────────────────────────────────────────────

export const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  onClose,
  task: taskProp,
  onSubmit,
  onDelete,
  title: titleOverride,
  sidebar,
  headerPrefix,
  renderHeaderActions,
  renderExtraFields,
  renderSubtasks,
  renderDependencies,
  renderDateField,
  renderAfterStatus,
  hideDates,
  onChecklistToggle,
}) => {
  // ── State ──────────────────────────────────────────────────────

  const [task, setTask] = useState<TaskData>(taskProp ?? emptyTask());
  const [dirty, setDirty] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Is this a "create" flow? (no existing id)
  const isCreate = !taskProp?.id;

  // ── Sync with external task prop ───────────────────────────────

  useEffect(() => {
    const next = taskProp ?? emptyTask();
    setTask(next);
    setDirty(false);
    setActiveField(null);
    setSubmitting(false);
    setDeleting(false);
    setSidebarOpen(false);
  }, [taskProp]);

  // Auto-focus title for create flow.
  useEffect(() => {
    if (open && isCreate) {
      setActiveField('title');
      setDirty(true); // show Save immediately so the user can create
    }
  }, [open, isCreate]);

  // Focus the active field's input after React commits the DOM.
  useEffect(() => {
    if (!activeField) return;
    const id = requestAnimationFrame(() => {
      const container = document.querySelector(
        `[data-edit-field="${activeField}"]`,
      );
      if (container) {
        const input = container.querySelector(
          'input:not([type="hidden"]), textarea, [contenteditable="true"], [role="combobox"]',
        );
        if (input) (input as HTMLElement).focus();
      }
    });
    return () => cancelAnimationFrame(id);
  }, [activeField]);

  // ── Helpers ────────────────────────────────────────────────────

  const handleField = useCallback(
    <K extends keyof TaskData>(key: K, value: TaskData[K]) => {
      setTask((prev) => ({ ...prev, [key]: value }));
      setDirty(true);
    },
    [],
  );

  const editable = (name: string) => isCreate || activeField === name;
  const openField = (name: string) => {
    if (isCreate) return; // all fields already editable — natural click focus is enough
    setActiveField(name);
    setDirty(true);
  };

  // ── Actions ────────────────────────────────────────────────────

  const handleCancel = useCallback(() => {
    if (isCreate) {
      onClose();
    } else {
      setTask(taskProp ?? emptyTask());
      setActiveField(null);
      setDirty(false);
    }
  }, [taskProp, isCreate, onClose]);

  const handleSubmit = async () => {
    if (!onSubmit) return;
    setSubmitting(true);
    try {
      await onSubmit(task);
      setDirty(false);
      setActiveField(null);
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

  // ── Derived ────────────────────────────────────────────────────

  const isEditing = activeField !== null || isCreate || dirty;
  const showDelete = !!taskProp?.id && onDelete;
  const headerTitle =
    titleOverride ?? (isCreate ? 'New Task' : 'Task Details');
  const sidebarBadge = sidebar?.reduce(
    (sum, t) => sum + (t.badge ?? 0),
    0,
  );

  // ── Render ─────────────────────────────────────────────────────

  return (
    <Dialog
      maxWidth={sidebarOpen && sidebar ? 'xl' : 'md'}
      fullWidth
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          minHeight: sidebarOpen ? '65vh' : 'auto',
          transition: 'max-width 0.25s ease',
        },
      }}
    >
      {/* ── Header ────────────────────────────────────────────── */}
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left: prefix + title */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            {headerPrefix}
            <Typography variant="h6" fontWeight="bold">
              {headerTitle}
            </Typography>
          </Box>

          {/* Right: actions + unsaved chip + sidebar toggle */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {renderHeaderActions?.()}
            {sidebar && sidebar.length > 0 && (
              <Button
                size="small"
                variant={sidebarOpen ? 'contained' : 'outlined'}
                startIcon={<ChatBubbleOutline fontSize="small" />}
                onClick={() => setSidebarOpen((p) => !p)}
              >
                {sidebarOpen
                  ? 'Hide sidebar'
                  : sidebarBadge && sidebarBadge > 0
                    ? `Sidebar (${sidebarBadge})`
                    : 'Sidebar'}
              </Button>
            )}
          </Box>
        </Box>
      </DialogTitle>

      {/* ── Body: form + optional sidebar ──────────────────────── */}
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* ── Left: form (click-to-edit) ────────────────────── */}
        <DialogContent
          sx={{
            flex: sidebarOpen ? 3 : 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            transition: 'flex 0.25s ease',
          }}
        >
          {/* Title — click to edit */}
          <Box
            onClick={() => openField('title')}
            data-edit-field="title"
            sx={{ cursor: 'pointer' }}
          >
            {editable('title') ? (
              <TextField
                label="Title"
                fullWidth
                size="small"
                autoFocus
                value={task.title ?? ''}
                onChange={(e) => handleField('title', e.target.value)}
                onBlur={() => setActiveField(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setActiveField(null);
                }}
                InputProps={{
                  // startAdornment: (
                  //   <Label sx={{ mr: 1, color: 'text.secondary' }} />
                  // ),
                }}
              />
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover .edit-hint': { opacity: 1 },
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  {task.title || '(Untitled)'}
                </Typography>
                <Edit
                  className="edit-hint"
                  sx={{
                    fontSize: 16,
                    color: 'text.disabled',
                    opacity: 0,
                    transition: 'opacity 0.15s',
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Description — click to edit */}
          <Box
            onClick={() => openField('description')}
            data-edit-field="description"
            sx={{ cursor: 'pointer' }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 0.5,
                '&:hover .edit-hint': { opacity: 1 },
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Description
              </Typography>
              <Edit
                className="edit-hint"
                sx={{
                  fontSize: 14,
                  color: 'text.disabled',
                  opacity: 0,
                  transition: 'opacity 0.15s',
                }}
              />
            </Box>
            <RichTextEditor
              editable={editable('description')}
              value={task.description ?? ''}
              onChange={(html) => handleField('description', html)}
              onChecklistToggle={onChecklistToggle}
              placeholder="Add a description…"
              minHeight={sidebarOpen ? 140 : 180}
            />
          </Box>

          {/* Status row */}
          <Box
            onClick={() => openField('status')}
            data-edit-field="status"
            sx={{ cursor: 'pointer' }}
          >
            {editable('status') ? (
              <FormControl size="small" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={task.status ?? 'Backlog'}
                  label="Status"
                  onChange={(e: SelectChangeEvent) => {
                    handleField('status', e.target.value as TaskStatus);
                    setActiveField(null);
                  }}
                  onBlur={() => setActiveField(null)}
                >
                  {STATUSES.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Box
                  sx={{
                    mt: 0.25,
                    display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover .edit-hint': { opacity: 1 },
                }}
              >
                <Chip
                  label={task.status ?? '—'}
                  size="small"
                  sx={{
                    bgcolor:
                      STATUS_COLOUR[
                        task.status as TaskStatus
                      ] ?? '#9e9e9e',
                    color: 'white',
                  }}
                />
                <Edit
                  className="edit-hint"
                  sx={{
                    fontSize: 14,
                    color: 'text.disabled',
                    opacity: 0,
                    transition: 'opacity 0.15s',
                  }}
                />
              </Box>
              </Box>
            )}
          </Box>

          {/* Owner / creator (injected) */}
          {renderAfterStatus?.() ?? null}

          {/* Dates row */}
          {!hideDates && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1.5,
            }}
          >
            {/* Dates — click to edit */}
            {(['startDate', 'endDate'] as const).map((key) => {
              const label =
                key === 'startDate' ? 'Start Date' : 'End Date';

              if (editable(key) && renderDateField) {
                return (
                  <Box key={key} sx={{ width: '100%' }}>
                    {renderDateField({
                      label,
                      value: task[key],
                      onChange: (v) => handleField(key, v),
                      editable: true,
                    })}
                  </Box>
                );
              }

              return (
                <Box
                  key={key}
                  onClick={() => openField(key)}
                  data-edit-field={key}
                  sx={{ cursor: 'pointer', width: '100%' }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {label}
                  </Typography>
                  {editable(key) ? (
                    <DefaultDateField
                      label={label}
                      value={task[key]}
                      onChange={(v) => handleField(key, v)}
                      autoFocus
                      onBlur={() => setActiveField(null)}
                    />
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        mt: 0.25,
                        '&:hover .edit-hint': { opacity: 1 },
                      }}
                    >
                      <Typography variant="body2">
                        {formatDate(task[key])}
                      </Typography>
                      <Edit
                        className="edit-hint"
                        sx={{
                          fontSize: 14,
                          color: 'text.disabled',
                          opacity: 0,
                          transition: 'opacity 0.15s',
                        }}
                      />
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
          )}

          {/* App-specific extra fields */}
          {renderExtraFields?.(activeField)}

          {/* Subtasks */}
          {renderSubtasks?.()}

          {/* Dependencies */}
          {renderDependencies?.()}
        </DialogContent>

        {/* ── Right panel: expandable sidebar ────────────────── */}
        {sidebarOpen && sidebar && sidebar.length > 0 && (
          <SidebarPanel tabs={sidebar} />
        )}
      </Box>

      {/* ── Footer ────────────────────────────────────────────── */}
      <Divider />
      <DialogActions
        sx={{
          // px: 3,
          // pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            showDelete ? 'space-between' : 'flex-end',
        }}
      >
        {showDelete && (
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
          {isEditing ? (
            <>
              <Button onClick={handleCancel} size="small">
                Cancel
              </Button>
              {onSubmit && (
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
                  {isCreate ? 'Create' : 'Save'}
                </Button>
              )}
            </>
          ) : (
            <Button onClick={onClose} size="small">
              Close
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};
