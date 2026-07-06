import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import type { KanbanTask } from '../../types/kanban';

interface HandoverModalProps {
  open: boolean;
  task: KanbanTask | null;
  onSubmit: (note: string) => Promise<void>;
  onCancel: () => void;
}

export const HandoverModal: React.FC<HandoverModalProps> = ({
  open,
  task,
  onSubmit,
  onCancel,
}) => {
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(note.trim());
      setNote('');
    } catch {
      // keep open on error
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setNote('');
    onCancel();
  };

  const src = task?.project ?? task?.estimate;

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          Handover for Review
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Add a note to help the reviewer understand what's been done
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Task info */}
        <Box
          sx={{
            bgcolor: 'action.hover',
            borderRadius: 1,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {src && (
            <Chip
              label={`${src.displayId} - ${src.name}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          <Typography variant="body2" fontWeight="medium">
            {task?.title}
          </Typography>
        </Box>

        {/* Note field */}
        <TextField
          autoFocus
          multiline
          minRows={3}
          maxRows={6}
          label="What should the reviewer know?"
          placeholder="E.g. 'Ready for review — the API integration is done but I'd like a second look at the error handling in auth.ts'"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          fullWidth
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              handleSubmit();
            }
          }}
          helperText="⌘+Enter to submit"
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!note.trim() || submitting}
        >
          {submitting ? 'Sending…' : 'Hand over for review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HandoverModal;
