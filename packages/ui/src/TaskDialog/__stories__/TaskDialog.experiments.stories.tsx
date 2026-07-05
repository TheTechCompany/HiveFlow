// ── TaskDialog — UX experiments ─────────────────────────────────────
//
// Four experimental variants exploring different directions for
// "elevating" the task dialog beyond the baseline view/edit toggle.
// Each is self-contained — no changes to the base TaskDialog component.

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  Autocomplete,
  Avatar,
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
  Tab,
  Tabs,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import {
  ChatBubbleOutline,
  Edit,
  History,
  Label,
  People,
  Send,
} from '@mui/icons-material';
import { RichTextEditor } from '../../RichTextEditor';
import type { TaskData, TaskStatus } from '../../types';

// ═══════════════════════════════════════════════════════════════════════
// Shared helpers & mock data
// ═══════════════════════════════════════════════════════════════════════

const STATUSES: TaskStatus[] = ['Backlog', 'In Progress', 'Reviewing', 'Finished'];
const STATUS_COLOUR: Record<TaskStatus, string> = {
  Backlog: '#9e9e9e',
  'In Progress': '#2196f3',
  Reviewing: '#ff9800',
  Finished: '#4caf50',
};

const populatedTask: TaskData = {
  title: 'Design the new onboarding flow',
  description: `
<h2>Overview</h2>
<p>Redesign the first-run experience. Focus on:</p>
<ul><li>≤ 3 screens</li><li>Social login</li><li>Skip-to-dashboard escape hatch</li></ul>
  `.trim(),
  status: 'In Progress',
  startDate: '2025-09-01',
  endDate: '2025-09-15',
};

const mockComments = [
  { id: '1', author: 'Alice', avatar: 'A', text: 'Wireframes look solid. One concern — the skip button is too prominent.', time: '2h ago' },
  { id: '2', author: 'Bob', avatar: 'B', text: 'Agreed. Let\'s make it a text link instead of a button.', time: '1h ago' },
  { id: '3', author: 'Charlie', avatar: 'C', text: 'Added the updated Figma link to the description.', time: '30m ago' },
];

const mockActivity = [
  { id: 'a1', who: 'Alice', what: 'changed status to In Progress', when: '3h ago' },
  { id: 'a2', who: 'Bob', what: 'changed start date to Sep 1', when: '1d ago' },
  { id: 'a3', who: 'Alice', what: 'created this task', when: '2d ago' },
];

const DialogWrapper: React.FC<{ children: (open: boolean, setOpen: (v: boolean) => void) => React.ReactNode }> =
  ({ children }) => {
    const [open, setOpen] = useState(true);
    return <>{children(open, setOpen)}</>;
  };

// ═══════════════════════════════════════════════════════════════════════
// Metadata — all experiments under one Storybook title
// ═══════════════════════════════════════════════════════════════════════

const meta: Meta = {
  title: 'TaskDialog/Experiments',
  tags: ['autodocs'],
};
export default meta;

// ═══════════════════════════════════════════════════════════════════════
// Experiment 1 — Single edit toggle in the header
// ═══════════════════════════════════════════════════════════════════════
//
// One "Edit" button lives in the DialogTitle bar.  View mode has zero
// inline pencil icons.  Clicking Edit flips the entire form.

const HeaderToggleDialog: React.FC<{
  open: boolean;
  task: TaskData;
  onClose: () => void;
  onSubmit?: (task: TaskData) => Promise<void>;
  onDelete?: () => Promise<void>;
}> = ({ open, task: initial, onClose, onSubmit, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [task, setTask] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleField = <K extends keyof TaskData>(k: K, v: TaskData[K]) =>
    setTask((p) => ({ ...p, [k]: v }));

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={onClose}>
      {/* ── Header with edit toggle ─────────────────────────── */}
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold">
            {editing ? 'Edit Task' : 'Task Details'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!editing && (
              <Button size="small" variant="outlined" startIcon={<Edit />} onClick={() => setEditing(true)}>
                Edit
              </Button>
            )}
            {editing && (
              <Button size="small" onClick={() => { setEditing(false); setTask(initial); }}>
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2, pb: 1 }}>
        {/* Title — no inline pencil */}
        {editing ? (
          <TextField label="Title" fullWidth size="small" value={task.title ?? ''}
            onChange={(e) => handleField('title', e.target.value)}
            InputProps={{ startAdornment: <Label sx={{ mr: 1, color: 'text.secondary' }} /> }}
          />
        ) : (
          <Typography variant="h5" fontWeight="bold">{task.title || '(Untitled)'}</Typography>
        )}

        {/* Description — no inline pencil */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Description</Typography>
          <RichTextEditor editable={editing} value={task.description ?? ''}
            onChange={(html) => handleField('description', html)} placeholder="Add a description…" minHeight={200} />
        </Box>

        {/* Status */}
        {editing ? (
          <Select size="small" value={task.status ?? 'Backlog'}
            onChange={(e: SelectChangeEvent) => handleField('status', e.target.value as TaskStatus)} fullWidth>
            {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        ) : (
          <Box>
            <Typography variant="caption" color="text.secondary">Status</Typography>
            <Box sx={{ mt: 0.25 }}>
              <Chip label={task.status ?? '—'} size="small"
                sx={{ bgcolor: STATUS_COLOUR[task.status as TaskStatus] ?? '#9e9e9e', color: 'white' }} />
            </Box>
          </Box>
        )}

        {/* Dates */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          {editing ? (
            <>
              <TextField size="small" type="date" label="Start Date" value={task.startDate ?? ''}
                onChange={(e) => handleField('startDate', e.target.value)} InputLabelProps={{ shrink: true }} />
              <TextField size="small" type="date" label="End Date" value={task.endDate ?? ''}
                onChange={(e) => handleField('endDate', e.target.value)} InputLabelProps={{ shrink: true }} />
            </>
          ) : (
            <>
              <Box><Typography variant="caption" color="text.secondary">Start Date</Typography>
                <Typography variant="body2">{task.startDate || '—'}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">End Date</Typography>
                <Typography variant="body2">{task.endDate || '—'}</Typography></Box>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, justifyContent: onDelete ? 'space-between' : 'flex-end' }}>
        {onDelete && (
          <Button onClick={async () => { setDeleting(true); try { await onDelete(); } finally { setDeleting(false); } }}
            disabled={deleting} variant="contained" color="error" size="small">
            {deleting ? <CircularProgress size={18} /> : 'Delete'}
          </Button>
        )}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose} size="small">{editing ? 'Cancel' : 'Close'}</Button>
          {editing && (
            <Button onClick={async () => { if (!onSubmit) return; setSubmitting(true); try { await onSubmit(task); } finally { setSubmitting(false); } }}
              disabled={submitting} color="primary" variant="contained" size="small">
              {submitting ? <CircularProgress size={18} sx={{ mr: 0.5 }} /> : null}Save
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export const HeaderToggle: StoryObj = {
  name: '1. Single edit toggle (header)',
  render: () => (
    <DialogWrapper>
      {(open, setOpen) => (
        <HeaderToggleDialog open={open} task={populatedTask} onClose={() => setOpen(false)}
          onSubmit={async (t) => { action('save')(t); setOpen(false); }}
          onDelete={async () => { action('delete')(); setOpen(false); }} />
      )}
    </DialogWrapper>
  ),
};

// ═══════════════════════════════════════════════════════════════════════
// Experiment 2 — Tabbed dialog
// ═══════════════════════════════════════════════════════════════════════
//
// Tabs separate Details, Comments, and Activity so the dialog doesn't
// become a bottomless scroll when extra content is attached.

const TabbedDialog: React.FC<{
  open: boolean;
  task: TaskData;
  onClose: () => void;
  onSubmit?: (task: TaskData) => Promise<void>;
  onDelete?: () => Promise<void>;
}> = ({ open, task: initial, onClose, onSubmit, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState(0);
  const [task, setTask] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [comment, setComment] = useState('');

  const handleField = <K extends keyof TaskData>(k: K, v: TaskData[K]) =>
    setTask((p) => ({ ...p, [k]: v }));

  const handleAddComment = () => {
    if (!comment.trim()) return;
    action('add-comment')(comment);
    setComment('');
  };

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={onClose}>
      {/* ── Header ──────────────────────────────────────────── */}
      <DialogTitle sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold">{task.title || 'Task Details'}</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!editing && (
              <Button size="small" variant="outlined" startIcon={<Edit />} onClick={() => setEditing(true)}>Edit</Button>
            )}
            {editing && (
              <Button size="small" onClick={() => { setEditing(false); setTask(initial); }}>Cancel</Button>
            )}
          </Box>
        </Box>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 1, mb: -1 }}>
          <Tab label="Details" />
          <Tab label={`Comments (${mockComments.length})`} />
          <Tab label="Activity" />
        </Tabs>
      </DialogTitle>
      <Divider />

      {/* ── Tab: Details ────────────────────────────────────── */}
      {tab === 0 && (
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2, pb: 1 }}>
          {editing ? (
            <TextField label="Title" fullWidth size="small" value={task.title ?? ''}
              onChange={(e) => handleField('title', e.target.value)}
              InputProps={{ startAdornment: <Label sx={{ mr: 1, color: 'text.secondary' }} /> }} />
          ) : (
            <Typography variant="h5" fontWeight="bold">{task.title || '(Untitled)'}</Typography>
          )}

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Description</Typography>
            <RichTextEditor editable={editing} value={task.description ?? ''}
              onChange={(html) => handleField('description', html)} placeholder="Add a description…" minHeight={160} />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Status</Typography>
              {editing ? (
                <Select size="small" value={task.status ?? 'Backlog'}
                  onChange={(e: SelectChangeEvent) => handleField('status', e.target.value as TaskStatus)} fullWidth>
                  {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              ) : (
                <Box sx={{ mt: 0.5 }}>
                  <Chip label={task.status ?? '—'} size="small"
                    sx={{ bgcolor: STATUS_COLOUR[task.status as TaskStatus] ?? '#9e9e9e', color: 'white' }} />
                </Box>
              )}
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Start</Typography>
              {editing ? (
                <TextField size="small" type="date" value={task.startDate ?? ''}
                  onChange={(e) => handleField('startDate', e.target.value)} InputLabelProps={{ shrink: true }} />
              ) : (
                <Typography variant="body2" sx={{ mt: 0.5 }}>{task.startDate || '—'}</Typography>
              )}
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">End</Typography>
              {editing ? (
                <TextField size="small" type="date" value={task.endDate ?? ''}
                  onChange={(e) => handleField('endDate', e.target.value)} InputLabelProps={{ shrink: true }} />
              ) : (
                <Typography variant="body2" sx={{ mt: 0.5 }}>{task.endDate || '—'}</Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
      )}

      {/* ── Tab: Comments ───────────────────────────────────── */}
      {tab === 1 && (
        <DialogContent sx={{ pt: 2, pb: 1, display: 'flex', flexDirection: 'column', height: 340 }}>
          <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
            {mockComments.map((c) => (
              <Box key={c.id} sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: 'primary.main' }}>{c.avatar}</Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    <Typography variant="subtitle2">{c.author}</Typography>
                    <Typography variant="caption" color="text.secondary">{c.time}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 0.25 }}>{c.text}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField size="small" fullWidth placeholder="Write a comment…" value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(); }} />
            <IconButton color="primary" onClick={handleAddComment} disabled={!comment.trim()}>
              <Send fontSize="small" />
            </IconButton>
          </Box>
        </DialogContent>
      )}

      {/* ── Tab: Activity ───────────────────────────────────── */}
      {tab === 2 && (
        <DialogContent sx={{ pt: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {mockActivity.map((a) => (
              <Box key={a.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <History sx={{ fontSize: 16, color: 'text.secondary', mt: 0.25 }} />
                <Box>
                  <Typography variant="body2">
                    <strong>{a.who}</strong> {a.what}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{a.when}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </DialogContent>
      )}

      {/* ── Footer ───────────────────────────────────────────── */}
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: onDelete ? 'space-between' : 'flex-end' }}>
        {onDelete && (
          <Button onClick={async () => { setDeleting(true); try { await onDelete(); } finally { setDeleting(false); } }}
            disabled={deleting} variant="contained" color="error" size="small">
            {deleting ? <CircularProgress size={18} /> : 'Delete'}
          </Button>
        )}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose} size="small">Close</Button>
          {editing && (
            <Button onClick={async () => { if (!onSubmit) return; setSubmitting(true); try { await onSubmit(task); } finally { setSubmitting(false); } }}
              disabled={submitting} color="primary" variant="contained" size="small">
              {submitting ? <CircularProgress size={18} sx={{ mr: 0.5 }} /> : null}Save
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export const Tabbed: StoryObj = {
  name: '2. Tabbed (Details / Comments / Activity)',
  render: () => (
    <DialogWrapper>
      {(open, setOpen) => (
        <TabbedDialog open={open} task={populatedTask} onClose={() => setOpen(false)}
          onSubmit={async (t) => { action('save')(t); setOpen(false); }}
          onDelete={async () => { action('delete')(); setOpen(false); }} />
      )}
    </DialogWrapper>
  ),
};

// ═══════════════════════════════════════════════════════════════════════
// Experiment 3 — Click-to-edit (inline)
// ═══════════════════════════════════════════════════════════════════════
//
// No explicit edit/view mode.  Each field flips to editable when
// clicked.  A "Save" bar appears at the bottom once anything is dirty.

const ClickToEditDialog: React.FC<{
  open: boolean;
  task: TaskData;
  onClose: () => void;
  onSubmit?: (task: TaskData) => Promise<void>;
  onDelete?: () => Promise<void>;
}> = ({ open, task: initial, onClose, onSubmit, onDelete }) => {
  const [task, setTask] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleField = <K extends keyof TaskData>(k: K, v: TaskData[K]) => {
    setTask((p) => ({ ...p, [k]: v }));
    setDirty(true);
  };

  const editable = (name: string) => activeField === name;
  const toggle = (name: string) => setActiveField((p) => (p === name ? null : name));

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold">Task Details</Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {dirty && (
              <Chip label="Unsaved changes" size="small" color="warning" variant="outlined" />
            )}
          </Box>
        </Box>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2, pb: 1 }}>
        {/* Title — click to edit */}
        <Box onClick={() => toggle('title')} sx={{ cursor: 'pointer' }}>
          {editable('title') ? (
            <TextField label="Title" fullWidth size="small" autoFocus value={task.title ?? ''}
              onChange={(e) => handleField('title', e.target.value)}
              onBlur={() => setActiveField(null)}
              InputProps={{ startAdornment: <Label sx={{ mr: 1, color: 'text.secondary' }} /> }}
              onKeyDown={(e) => { if (e.key === 'Enter') setActiveField(null); }} />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, '&:hover .edit-hint': { opacity: 1 } }}>
              <Typography variant="h5" fontWeight="bold">{task.title || '(Untitled)'}</Typography>
              <Edit className="edit-hint" sx={{ fontSize: 16, color: 'text.disabled', opacity: 0, transition: 'opacity 0.15s' }} />
            </Box>
          )}
        </Box>

        {/* Description — click to edit */}
        <Box onClick={() => toggle('description')} sx={{ cursor: 'pointer' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5,
            '&:hover .edit-hint': { opacity: 1 } }}>
            <Typography variant="caption" color="text.secondary">Description</Typography>
            <Edit className="edit-hint" sx={{ fontSize: 14, color: 'text.disabled', opacity: 0, transition: 'opacity 0.15s' }} />
          </Box>
          <RichTextEditor editable={editable('description')} value={task.description ?? ''}
            onChange={(html) => handleField('description', html)} placeholder="Add a description…" minHeight={160} />
        </Box>

        {/* Status — click to edit */}
        <Box onClick={() => toggle('status')} sx={{ cursor: 'pointer' }}>
          {editable('status') ? (
            <Select size="small" autoFocus value={task.status ?? 'Backlog'}
              onChange={(e: SelectChangeEvent) => { handleField('status', e.target.value as TaskStatus); setActiveField(null); }}
              onBlur={() => setActiveField(null)} fullWidth>
              {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          ) : (
            <Box>
              <Typography variant="caption" color="text.secondary">Status</Typography>
              <Box sx={{ mt: 0.25, display: 'flex', alignItems: 'center', gap: 1,
                '&:hover .edit-hint': { opacity: 1 } }}>
                <Chip label={task.status ?? '—'} size="small"
                  sx={{ bgcolor: STATUS_COLOUR[task.status as TaskStatus] ?? '#9e9e9e', color: 'white' }} />
                <Edit className="edit-hint" sx={{ fontSize: 14, color: 'text.disabled', opacity: 0, transition: 'opacity 0.15s' }} />
              </Box>
            </Box>
          )}
        </Box>

        {/* Dates — click to edit */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          {['startDate', 'endDate'].map((key) => (
            <Box key={key} onClick={() => toggle(key)} sx={{ cursor: 'pointer' }}>
              <Typography variant="caption" color="text.secondary">
                {key === 'startDate' ? 'Start Date' : 'End Date'}
              </Typography>
              {editable(key) ? (
                <TextField size="small" type="date" autoFocus fullWidth
                  value={(task as any)[key] ?? ''}
                  onChange={(e) => handleField(key as keyof TaskData, e.target.value)}
                  onBlur={() => setActiveField(null)}
                  InputLabelProps={{ shrink: true }} />
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25,
                  '&:hover .edit-hint': { opacity: 1 } }}>
                  <Typography variant="body2">{(task as any)[key] || '—'}</Typography>
                  <Edit className="edit-hint" sx={{ fontSize: 14, color: 'text.disabled', opacity: 0, transition: 'opacity 0.15s' }} />
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, justifyContent: onDelete ? 'space-between' : 'flex-end' }}>
        {onDelete && (
          <Button onClick={async () => { setDeleting(true); try { await onDelete(); } finally { setDeleting(false); } }}
            disabled={deleting} variant="contained" color="error" size="small">
            {deleting ? <CircularProgress size={18} /> : 'Delete'}
          </Button>
        )}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose} size="small">Close</Button>
          {dirty && (
            <Button onClick={async () => { if (!onSubmit) return; setSubmitting(true); try { await onSubmit(task); setDirty(false); } finally { setSubmitting(false); } }}
              disabled={submitting} color="primary" variant="contained" size="small">
              {submitting ? <CircularProgress size={18} sx={{ mr: 0.5 }} /> : null}Save
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export const ClickToEdit: StoryObj = {
  name: '3. Click-to-edit (inline)',
  render: () => (
    <DialogWrapper>
      {(open, setOpen) => (
        <ClickToEditDialog open={open} task={populatedTask} onClose={() => setOpen(false)}
          onSubmit={async (t) => { action('save')(t); setOpen(false); }}
          onDelete={async () => { action('delete')(); setOpen(false); }} />
      )}
    </DialogWrapper>
  ),
};

// ═══════════════════════════════════════════════════════════════════════
// Experiment 4 — Click-to-edit + expandable sidebar
// ═══════════════════════════════════════════════════════════════════════
//
// Click-to-edit is the default posture (compact, single-panel, md width).
// An "Expand" toggle in the header opens a right sidebar with comments
// and activity — the dialog widens to xl.  The sidebar is an expansion,
// not a permanent split.  All editing is still inline click-to-edit.

const mockPeople = [
  { id: '1', name: 'Alice', avatar: 'A', role: 'Designer' },
  { id: '2', name: 'Bob', avatar: 'B', role: 'Developer' },
  { id: '3', name: 'Charlie', avatar: 'C', role: 'Reviewer' },
  { id: '4', name: 'Diana', avatar: 'D', role: 'PM' },
];

const ClickToEditExpandableDialog: React.FC<{
  open: boolean;
  task: TaskData;
  onClose: () => void;
  onSubmit?: (task: TaskData) => Promise<void>;
  onDelete?: () => Promise<void>;
}> = ({ open, task: initial, onClose, onSubmit, onDelete }) => {
  const [task, setTask] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ── Sidebar expansion ──────────────────────────────────────────
  const [expanded, setExpanded] = useState(false);
  const [sidebarTab, setSidebarTab] = useState(0);
  const [comment, setComment] = useState('');

  // ── Assigned people ────────────────────────────────────────────
  const [assigned, setAssigned] = useState([mockPeople[0], mockPeople[1]]);

  const handleField = <K extends keyof TaskData>(k: K, v: TaskData[K]) => {
    setTask((p) => ({ ...p, [k]: v }));
    setDirty(true);
  };

  const editable = (name: string) => activeField === name;
  const toggle = (name: string) => setActiveField((p) => (p === name ? null : name));

  const handleAddComment = () => {
    if (!comment.trim()) return;
    action('add-comment')(comment);
    setComment('');
  };

  return (
    <Dialog
      maxWidth={expanded ? 'xl' : 'md'}
      fullWidth
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { minHeight: expanded ? '65vh' : 'auto', transition: 'max-width 0.25s ease' } }}
    >
      {/* ── Header with expand toggle ─────────────────────────── */}
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold">Task Details</Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {dirty && (
              <Chip label="Unsaved changes" size="small" color="warning" variant="outlined" />
            )}
            {/* ── Assigned avatars (always visible) ────────── */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {assigned.map((p) => (
                <Avatar
                  key={p.id}
                  sx={{ width: 28, height: 28, fontSize: 12, bgcolor: 'primary.main', cursor: 'default' }}
                  title={`${p.name} — ${p.role}`}
                >
                  {p.avatar}
                </Avatar>
              ))}
              {assigned.length === 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
                  Unassigned
                </Typography>
              )}
            </Box>
            <Button
              size="small"
              variant={expanded ? 'contained' : 'outlined'}
              startIcon={<ChatBubbleOutline fontSize="small" />}
              onClick={() => setExpanded((p) => !p)}
            >
              {expanded ? 'Hide sidebar' : `Comments (${mockComments.length})`}
            </Button>
          </Box>
        </Box>
      </DialogTitle>
      <Divider />

      {/* ── Body: single-panel or split ────────────────────────── */}
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* ── Left: form (click-to-edit) ──────────────────────── */}
        <DialogContent
          sx={{
            flex: expanded ? 3 : 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pt: 2,
            pb: 1,
            transition: 'flex 0.25s ease',
          }}
        >
          {/* Title — click to edit */}
          <Box onClick={() => toggle('title')} sx={{ cursor: 'pointer' }}>
            {editable('title') ? (
              <TextField
                label="Title"
                fullWidth
                size="small"
                autoFocus
                value={task.title ?? ''}
                onChange={(e) => handleField('title', e.target.value)}
                onBlur={() => setActiveField(null)}
                InputProps={{ startAdornment: <Label sx={{ mr: 1, color: 'text.secondary' }} /> }}
                onKeyDown={(e) => { if (e.key === 'Enter') setActiveField(null); }}
              />
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, '&:hover .edit-hint': { opacity: 1 } }}>
                <Typography variant="h5" fontWeight="bold">{task.title || '(Untitled)'}</Typography>
                <Edit className="edit-hint" sx={{ fontSize: 16, color: 'text.disabled', opacity: 0, transition: 'opacity 0.15s' }} />
              </Box>
            )}
          </Box>

          {/* Description — click to edit */}
          <Box onClick={() => toggle('description')} sx={{ cursor: 'pointer' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5, '&:hover .edit-hint': { opacity: 1 } }}>
              <Typography variant="caption" color="text.secondary">Description</Typography>
              <Edit className="edit-hint" sx={{ fontSize: 14, color: 'text.disabled', opacity: 0, transition: 'opacity 0.15s' }} />
            </Box>
            <RichTextEditor
              editable={editable('description')}
              value={task.description ?? ''}
              onChange={(html) => handleField('description', html)}
              placeholder="Add a description…"
              minHeight={expanded ? 140 : 180}
            />
          </Box>

          {/* Status + Dates row */}
          <Box sx={{ display: 'grid', gridTemplateColumns: expanded ? '1fr 1fr 1fr' : '1fr 1fr', gap: 1.5 }}>
            {/* Status — click to edit */}
            <Box onClick={() => toggle('status')} sx={{ cursor: 'pointer' }}>
              {editable('status') ? (
                <Select
                  size="small"
                  autoFocus
                  value={task.status ?? 'Backlog'}
                  onChange={(e: SelectChangeEvent) => { handleField('status', e.target.value as TaskStatus); setActiveField(null); }}
                  onBlur={() => setActiveField(null)}
                  fullWidth
                >
                  {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Box sx={{ mt: 0.25, display: 'flex', alignItems: 'center', gap: 1, '&:hover .edit-hint': { opacity: 1 } }}>
                    <Chip label={task.status ?? '—'} size="small"
                      sx={{ bgcolor: STATUS_COLOUR[task.status as TaskStatus] ?? '#9e9e9e', color: 'white' }} />
                    <Edit className="edit-hint" sx={{ fontSize: 14, color: 'text.disabled', opacity: 0, transition: 'opacity 0.15s' }} />
                  </Box>
                </Box>
              )}
            </Box>

            {/* Dates — click to edit */}
            {['startDate', 'endDate'].map((key) => (
              <Box key={key} onClick={() => toggle(key)} sx={{ cursor: 'pointer' }}>
                <Typography variant="caption" color="text.secondary">
                  {key === 'startDate' ? 'Start Date' : 'End Date'}
                </Typography>
                {editable(key) ? (
                  <TextField
                    size="small" type="date" autoFocus fullWidth
                    value={(task as any)[key] ?? ''}
                    onChange={(e) => handleField(key as keyof TaskData, e.target.value)}
                    onBlur={() => setActiveField(null)}
                    InputLabelProps={{ shrink: true }}
                  />
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25, '&:hover .edit-hint': { opacity: 1 } }}>
                    <Typography variant="body2">{(task as any)[key] || '—'}</Typography>
                    <Edit className="edit-hint" sx={{ fontSize: 14, color: 'text.disabled', opacity: 0, transition: 'opacity 0.15s' }} />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </DialogContent>

        {/* ── Right panel: expanded sidebar ────────────────────── */}
        {expanded && (
          <>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
              <Tabs value={sidebarTab} onChange={(_, v) => setSidebarTab(v)} sx={{ px: 2, pt: 1 }}>
                <Tab icon={<ChatBubbleOutline fontSize="small" />} label="Comments" iconPosition="start"
                  sx={{ minHeight: 40, fontSize: '0.8rem' }} />
                <Tab icon={<History fontSize="small" />} label="Activity" iconPosition="start"
                  sx={{ minHeight: 40, fontSize: '0.8rem' }} />
                <Tab icon={<People fontSize="small" />} label={`People (${assigned.length})`} iconPosition="start"
                  sx={{ minHeight: 40, fontSize: '0.8rem' }} />
              </Tabs>
              <Divider />

              {sidebarTab === 0 && (
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2, overflow: 'auto' }}>
                  <Box sx={{ flex: 1, overflow: 'auto', mb: 1.5 }}>
                    {mockComments.map((c) => (
                      <Box key={c.id} sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: 'primary.main' }}>{c.avatar}</Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontSize: '0.8rem' }}>{c.author}</Typography>
                            <Typography variant="caption" color="text.secondary">{c.time}</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ mt: 0.25, fontSize: '0.8rem' }}>{c.text}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField size="small" fullWidth placeholder="Write a comment…" value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(); }} />
                    <IconButton size="small" color="primary" onClick={handleAddComment} disabled={!comment.trim()}>
                      <Send fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              )}

              {sidebarTab === 1 && (
                <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
                  {mockActivity.map((a) => (
                    <Box key={a.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 1.5 }}>
                      <History sx={{ fontSize: 14, color: 'text.secondary', mt: 0.25 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          <strong>{a.who}</strong> {a.what}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">{a.when}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              {sidebarTab === 2 && (
                <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
                  {/* ── Add person ──────────────────────────── */}
                  <Autocomplete
                    size="small"
                    options={mockPeople.filter((p) => !assigned.find((a) => a.id === p.id))}
                    getOptionLabel={(p) => `${p.name} — ${p.role}`}
                    value={null}
                    onChange={(_, person) => {
                      if (person) setAssigned((prev) => [...prev, person]);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Add person…" size="small" />
                    )}
                    sx={{ mb: 2 }}
                  />

                  {/* ── Currently assigned ──────────────────── */}
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Assigned
                  </Typography>
                  {assigned.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No one assigned yet.
                    </Typography>
                  )}
                  {assigned.map((p) => (
                    <Box
                      key={p.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        py: 0.75,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>{p.avatar}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>{p.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{p.role}</Typography>
                        </Box>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => setAssigned((prev) => prev.filter((a) => a.id !== p.id))}
                        sx={{ color: 'text.secondary' }}
                      >
                        <Send sx={{ fontSize: 14, transform: 'rotate(180deg)' }} />
                      </IconButton>
                    </Box>
                  ))}

                  {/* ── Available people ────────────────────── */}
                  {mockPeople.filter((p) => !assigned.find((a) => a.id === p.id)).length > 0 && (
                    <>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, mb: 1, display: 'block' }}>
                        Available
                      </Typography>
                      {mockPeople
                        .filter((p) => !assigned.find((a) => a.id === p.id))
                        .map((p) => (
                          <Box
                            key={p.id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              py: 0.75,
                              borderBottom: '1px solid',
                              borderColor: 'divider',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: 'grey.400' }}>{p.avatar}</Avatar>
                              <Box>
                                <Typography variant="body2">{p.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{p.role}</Typography>
                              </Box>
                            </Box>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => setAssigned((prev) => [...prev, p])}
                            >
                              <Send sx={{ fontSize: 14, transform: 'rotate(-45deg)' }} />
                            </IconButton>
                          </Box>
                        ))}
                    </>
                  )}
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>

      <Divider />
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: onDelete ? 'space-between' : 'flex-end' }}>
        {onDelete && (
          <Button onClick={async () => { setDeleting(true); try { await onDelete(); } finally { setDeleting(false); } }}
            disabled={deleting} variant="contained" color="error" size="small">
            {deleting ? <CircularProgress size={18} /> : 'Delete'}
          </Button>
        )}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose} size="small">Close</Button>
          {dirty && (
            <Button onClick={async () => { if (!onSubmit) return; setSubmitting(true); try { await onSubmit(task); setDirty(false); } finally { setSubmitting(false); } }}
              disabled={submitting} color="primary" variant="contained" size="small">
              {submitting ? <CircularProgress size={18} sx={{ mr: 0.5 }} /> : null}Save
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export const ClickToEditExpandable: StoryObj = {
  name: '4. Click-to-edit + expandable sidebar',
  render: () => (
    <DialogWrapper>
      {(open, setOpen) => (
        <ClickToEditExpandableDialog open={open} task={populatedTask} onClose={() => setOpen(false)}
          onSubmit={async (t) => { action('save')(t); setOpen(false); }}
          onDelete={async () => { action('delete')(); setOpen(false); }} />
      )}
    </DialogWrapper>
  ),
};
