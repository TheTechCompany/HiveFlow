import React, { useEffect, useState } from 'react';
import {
  Edit,
  Label,
} from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Typography,
  Alert,
  Chip,
} from '@mui/material';
import { FormControl } from '@hexhive/ui';
import { RichTextEditor } from '@hive-flow/ui';
import { gql, useMutation } from '@apollo/client';

// ── GraphQL ─────────────────────────────────────────────────────────

const CREATE_CI = gql`
  mutation CreateContinuousImprovement($input: ContinuousImprovementInput!) {
    createContinuousImprovement(input: $input) {
      id
      displayId
      title
      status
    }
  }
`;

const UPDATE_CI = gql`
  mutation UpdateContinuousImprovement($id: ID!, $input: ContinuousImprovementUpdateInput!) {
    updateContinuousImprovement(id: $id, input: $input) {
      id
      displayId
      title
      status
    }
  }
`;

const DELETE_CI = gql`
  mutation DeleteContinuousImprovement($id: ID!) {
    deleteContinuousImprovement(id: $id) {
      id
    }
  }
`;

// ── Constants ───────────────────────────────────────────────────────

const CI_CATEGORIES = [
  'Safety', 'Quality', 'Process', 'Equipment',
  '5S', 'Training', 'Environmental', 'Other',
];

const CI_SOURCES = [
  'staff-suggestion',
  'internal-audit',
  'customer-feedback',
  'management-review',
  'incident-report',
  'other',
];

const CI_PRIORITIES = ['low', 'medium', 'high', 'critical'];

const CI_STATUSES = ['identified', 'in_progress', 'implemented', 'verified', 'closed'];

const STATUS_LABELS: Record<string, string> = {
  'identified': 'Identified',
  'in_progress': 'In Progress',
  'implemented': 'Implemented',
  'verified': 'Verified',
  'closed': 'Closed',
};

// ── Types ───────────────────────────────────────────────────────────

export interface CiDetail {
  id: string;
  displayId?: string | null;
  title: string;
  description?: string | null;
  category?: string | null;
  source?: string | null;
  status: string;
  priority?: string | null;
  impact?: string | null;
  rootCause?: string | null;
  actionTaken?: string | null;
  outcomeMeasured?: string | null;
  createdBy?: { id: string; name: string } | null;
  assignedTo?: { id: string; name: string } | null;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string | null;
}

interface CiUpdateModalProps {
  open: boolean;
  selected?: CiDetail | null;
  users?: Array<{ id: string; name: string }>;
  onClose: () => void;
  onCreated?: (ci: { id: string; displayId: string }) => void;
  onUpdated?: () => void;
  onDeleted?: () => void;
}

interface CiUpdateState {
  title: string;
  description: string;
  category: string;
  source: string;
  status: string;
  priority: string;
  impact: string;
  rootCause: string;
  actionTaken: string;
  outcomeMeasured: string;
  assignedTo: string;
}

// ── Component ───────────────────────────────────────────────────────

export const CiUpdateModal: React.FC<CiUpdateModalProps> = (props) => {
  const isNew = !props.selected?.id;
  const [editing, setEditing] = useState(isNew);
  const [success, setSuccess] = useState<string | null>(null);

  const [data, setData] = useState<CiUpdateState>({
    title: '',
    description: '',
    category: '',
    source: '',
    status: 'identified',
    priority: '',
    impact: '',
    rootCause: '',
    actionTaken: '',
    outcomeMeasured: '',
    assignedTo: '',
  });

  // Sync state when selected changes
  useEffect(() => {
    const s = props.selected;
    setEditing(!s?.id);
    setData({
      title: s?.title ?? '',
      description: s?.description ?? '',
      category: s?.category ?? '',
      source: s?.source ?? '',
      status: s?.status ?? 'identified',
      priority: s?.priority ?? '',
      impact: s?.impact ?? '',
      rootCause: s?.rootCause ?? '',
      actionTaken: s?.actionTaken ?? '',
      outcomeMeasured: s?.outcomeMeasured ?? '',
      assignedTo: s?.assignedTo?.id ?? '',
    });
    setSuccess(null);
  }, [props.selected]);

  // ── Mutations ──────────────────────────────────────────────────

  const [createCi, { loading: createLoading, error: createError }] = useMutation(CREATE_CI, {
    onCompleted: (result) => {
      const ci = result?.createContinuousImprovement;
      setSuccess(`CI ${ci?.displayId} created successfully.`);
      props.onCreated?.(ci);
      setTimeout(() => {
        setData({
          title: '', description: '', category: '', source: '',
          status: 'identified', priority: '', impact: '', rootCause: '',
          actionTaken: '', outcomeMeasured: '', assignedTo: '',
        });
        setSuccess(null);
        props.onClose();
      }, 1500);
    },
  });

  const [updateCi, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_CI, {
    onCompleted: () => {
      setSuccess('CI updated successfully.');
      setEditing(false);
      props.onUpdated?.();
    },
  });

  const [deleteCi, { loading: deleteLoading }] = useMutation(DELETE_CI, {
    onCompleted: () => {
      setSuccess('CI deleted.');
      props.onDeleted?.();
      setTimeout(() => props.onClose(), 800);
    },
  });

  const loading = createLoading || updateLoading || deleteLoading;
  const error = createError || updateError;

  const submit = async () => {
    if (!data.title.trim()) return;
    if (isNew) {
      await createCi({
        variables: {
          input: {
            title: data.title,
            description: data.description || null,
            category: data.category || null,
            source: data.source || null,
            priority: data.priority || null,
            impact: data.impact || null,
            rootCause: data.rootCause || null,
            assignedTo: data.assignedTo || null,
          },
        },
      });
    } else {
      await updateCi({
        variables: {
          id: props.selected!.id,
          input: {
            title: data.title,
            description: data.description || null,
            category: data.category || null,
            source: data.source || null,
            status: data.status || null,
            priority: data.priority || null,
            impact: data.impact || null,
            rootCause: data.rootCause || null,
            actionTaken: data.actionTaken || null,
            outcomeMeasured: data.outcomeMeasured || null,
            assignedTo: data.assignedTo || null,
          },
        },
      });
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSuccess(null);
      props.onClose();
    }
  };

  // ── Read-only field helpers ─────────────────────────────────────

  const readOnlyField = (label: string, value: string | undefined | null) => (
    <Box>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body2">{value || '—'}</Typography>
    </Box>
  );

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      onClose={handleClose}
      open={props.open}
      PaperProps={{ sx: { minHeight: '60vh' } }}
    >
      {/* ── Header ──────────────────────────────────────────────── */}
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {isNew
                ? 'New Continuous Improvement'
                : editing
                  ? 'Edit CI'
                  : props.selected?.displayId ?? 'CI Details'}
            </Typography>
            {!isNew && !editing && (
              <IconButton size="small" onClick={() => setEditing(true)} color="primary">
                <Edit fontSize="small" />
              </IconButton>
            )}
          </Box>
          {!isNew && (
            <Chip
              label={STATUS_LABELS[data.status] ?? data.status}
              size="small"
              sx={{
                bgcolor:
                  data.status === 'identified' ? '#9e9e9e' :
                  data.status === 'in_progress' ? '#4caf50' :
                  data.status === 'implemented' ? '#2196f3' :
                  data.status === 'verified' ? '#9c27b0' :
                  data.status === 'closed' ? '#757575' : '#9e9e9e',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          )}
        </Box>
      </DialogTitle>
      <Divider />

      {/* ── Body ────────────────────────────────────────────────── */}
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2, pb: 1 }}>
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">Failed: {error.message}</Alert>}

        {/* Title */}
        {editing ? (
          <TextField
            label="Title"
            fullWidth
            size="small"
            required
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            InputProps={{
              startAdornment: <Label sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        ) : (
          <Typography variant="h5" fontWeight="bold">{data.title || '(Untitled)'}</Typography>
        )}

        {/* Description */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Description
          </Typography>
          <RichTextEditor
            editable={editing}
            value={data.description ?? ''}
            onChange={(html) => setData({ ...data, description: html })}
            placeholder="Add a description…"
            minHeight={150}
          />
        </Box>

        {/* Category + Source (side-by-side in view, stacked in edit) */}
        {editing ? (
          <>
            <FormControl
              placeholder="Category"
              value={data.category}
              onChange={(val) => setData({ ...data, category: val })}
              labelKey="label"
              valueKey="id"
              options={CI_CATEGORIES.map((x) => ({ id: x, label: x }))}
            />
            <FormControl
              placeholder="Source"
              value={data.source}
              onChange={(val) => setData({ ...data, source: val })}
              labelKey="label"
              valueKey="id"
              options={CI_SOURCES.map((x) => ({ id: x, label: x.replace(/-/g, ' ') }))}
            />
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 3 }}>
            {readOnlyField('Category', data.category)}
            {readOnlyField('Source', data.source?.replace(/-/g, ' '))}
          </Box>
        )}

        {/* Priority + Assigned to */}
        {editing ? (
          <>
            <FormControl
              placeholder="Priority"
              value={data.priority}
              onChange={(val) => setData({ ...data, priority: val })}
              labelKey="label"
              valueKey="id"
              options={CI_PRIORITIES.map((x) => ({ id: x, label: x }))}
            />
            <FormControl
              placeholder="Assigned to"
              value={data.assignedTo}
              onChange={(val) => setData({ ...data, assignedTo: val })}
              labelKey="name"
              valueKey="id"
              options={props.users ?? []}
            />
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 3 }}>
            {readOnlyField('Priority', data.priority)}
            {readOnlyField('Assigned to', props.users?.find((u) => u.id === data.assignedTo)?.name)}
          </Box>
        )}

        {/* Status (edit mode only for existing CIs) */}
        {!isNew && editing && (
          <FormControl
            placeholder="Status"
            value={data.status}
            onChange={(val) => setData({ ...data, status: val })}
            labelKey="label"
            valueKey="id"
            options={CI_STATUSES.map((x) => ({ id: x, label: STATUS_LABELS[x] ?? x }))}
          />
        )}

        {/* Impact */}
        {editing ? (
          <TextField
            label="Expected Impact"
            fullWidth
            size="small"
            multiline
            minRows={2}
            value={data.impact}
            onChange={(e) => setData({ ...data, impact: e.target.value })}
          />
        ) : data.impact ? (
          readOnlyField('Expected Impact', data.impact)
        ) : null}

        {/* Root Cause */}
        {editing ? (
          <TextField
            label="Root Cause (if known)"
            fullWidth
            size="small"
            multiline
            minRows={2}
            value={data.rootCause}
            onChange={(e) => setData({ ...data, rootCause: e.target.value })}
          />
        ) : data.rootCause ? (
          readOnlyField('Root Cause', data.rootCause)
        ) : null}

        {/* Action Taken (edit/view only) */}
        {!isNew && (
          editing ? (
            <TextField
              label="Action Taken"
              fullWidth
              size="small"
              multiline
              minRows={2}
              value={data.actionTaken}
              onChange={(e) => setData({ ...data, actionTaken: e.target.value })}
            />
          ) : data.actionTaken ? (
            readOnlyField('Action Taken', data.actionTaken)
          ) : null
        )}

        {/* Outcome Measured (edit/view only) */}
        {!isNew && (
          editing ? (
            <TextField
              label="Outcome Measured"
              fullWidth
              size="small"
              multiline
              minRows={2}
              value={data.outcomeMeasured}
              onChange={(e) => setData({ ...data, outcomeMeasured: e.target.value })}
            />
          ) : data.outcomeMeasured ? (
            readOnlyField('Outcome Measured', data.outcomeMeasured)
          ) : null
        )}

        {/* Meta info (view only) */}
        {!isNew && !editing && (
          <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
            {readOnlyField('Created by', props.selected?.createdBy?.name)}
            {readOnlyField('Created', props.selected?.createdAt ? new Date(props.selected.createdAt).toLocaleDateString() : null)}
            {readOnlyField('Updated', props.selected?.updatedAt ? new Date(props.selected.updatedAt).toLocaleDateString() : null)}
            {readOnlyField('Completed', props.selected?.completedAt ? new Date(props.selected.completedAt).toLocaleDateString() : null)}
          </Box>
        )}
      </DialogContent>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <DialogActions sx={{ px: 3, pb: 2, display: 'flex', justifyContent: !isNew ? 'space-between' : 'flex-end' }}>
        {!isNew && editing && (
          <Button
            onClick={() => deleteCi({ variables: { id: props.selected!.id } })}
            disabled={loading}
            variant="contained"
            color="error"
            size="small"
          >
            {deleteLoading ? <CircularProgress size={18} /> : 'Delete'}
          </Button>
        )}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={handleClose} size="small" disabled={loading}>
            {editing ? 'Cancel' : 'Close'}
          </Button>
          {editing && (
            <Button
              onClick={submit}
              disabled={loading || !data.title.trim()}
              color="primary"
              variant="contained"
              size="small"
            >
              {loading ? <CircularProgress size={18} sx={{ mr: 0.5 }} /> : null}
              {isNew ? 'Submit CI' : 'Save'}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};
