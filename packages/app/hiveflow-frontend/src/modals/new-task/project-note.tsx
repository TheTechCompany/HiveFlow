import React, { useState } from 'react';
import {
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
  TextField,
  Typography,
} from '@mui/material';
import { RichTextEditor } from '@hive-flow/ui';

// ── Types ───────────────────────────────────────────────────────────

interface ProjectNoteModalProps {
  open: boolean;
  selected?: any;
  onClose: () => void;
  onSubmit?: (data: any) => Promise<void>;
  onDelete?: () => Promise<void>;
}

interface ProjectNoteState {
  title?: string;
  description?: string;
}

// ── Component ───────────────────────────────────────────────────────

export const ProjectNoteModal: React.FC<ProjectNoteModalProps> = (props) => {
  const isNew = !props.selected?.id;
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [data, setData] = useState<ProjectNoteState>({
    title: props.selected?.title ?? '',
    description: props.selected?.description ?? '',
  });

  const submit = async () => {
    setLoading(true);
    try {
      await props.onSubmit?.({
        ...data,
        taskType: 'project_note',
        status: 'Backlog',
        startDate: new Date(),
        endDate: new Date(),
      });
    } catch {
      // keep dialog open on failure
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    setDeleteLoading(true);
    try {
      await props.onDelete?.();
    } catch {
      // keep dialog open on failure
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      onClose={props.onClose}
      open={props.open}
      PaperProps={{ sx: { minHeight: '45vh' } }}
    >
      {/* ── Header ──────────────────────────────────────────────── */}
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          {isNew ? 'New Project Note' : 'Project Note'}
        </Typography>
      </DialogTitle>
      <Divider />

      {/* ── Body ────────────────────────────────────────────────── */}
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2, pb: 1 }}>
        {/* Title */}
        <TextField
          label="Title"
          fullWidth
          size="small"
          value={data.title ?? ''}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          InputProps={{
            startAdornment: <Label sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />

        {/* Description */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Description
          </Typography>
          <RichTextEditor
            editable
            value={data.description ?? ''}
            onChange={(html) => setData({ ...data, description: html })}
            placeholder="Add a note…"
            minHeight={200}
          />
        </Box>
      </DialogContent>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          display: 'flex',
          justifyContent: !isNew ? 'space-between' : 'flex-end',
        }}
      >
        {!isNew && (
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
          <Button onClick={props.onClose} size="small">Cancel</Button>
          <Button
            onClick={submit}
            disabled={loading}
            color="primary"
            variant="contained"
            size="small"
          >
            {loading ? <CircularProgress size={18} sx={{ mr: 0.5 }} /> : null}
            {isNew ? 'Create' : 'Save'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
