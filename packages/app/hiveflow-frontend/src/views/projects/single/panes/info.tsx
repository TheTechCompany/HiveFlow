import React, { useCallback } from 'react';
import {
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useMutation } from '@apollo/client';
import { UPDATE_PROJECT } from '@hive-flow/api';
import { MemberList } from '../../../../modals/new-task/members';
import moment from 'moment';

// ── Types ───────────────────────────────────────────────────────────

interface InfoPaneProps {
  project: any;
  users: any[];
  onRefetch: () => void;
}

// ── Component ───────────────────────────────────────────────────────

export const InfoPane: React.FC<InfoPaneProps> = ({ project, users, onRefetch }) => {
  const [updateProject, { loading }] = useMutation(UPDATE_PROJECT);

  const update = useCallback(
    (data: Record<string, any>) => {
      updateProject({
        variables: {
          id: project?.id,
          input: { ...data, id: project?.displayId },
        },
      }).then(() => onRefetch());
    },
    [updateProject, project, onRefetch],
  );

  if (!project) {
    return (
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography color="text.secondary">Loading project info…</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, overflow: 'auto', p: 3, bgcolor: 'background.default' }}>
      <Stack spacing={3}>
        <Typography variant="h6" fontWeight="bold">
          Project Info
        </Typography>

        {/* Name */}
        <TextField
          label="Project Name"
          fullWidth
          size="small"
          defaultValue={project.name ?? ''}
          onBlur={(e) => {
            if (e.target.value !== (project.name ?? '')) {
              update({ name: e.target.value });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          }}
        />

        {/* Display ID (read-only) */}
        <TextField
          label="Display ID"
          fullWidth
          size="small"
          value={project.displayId ?? ''}
          disabled
          helperText="Read-only identifier"
        />

        {/* Status */}
        <FormControl size="small">
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={project.status ?? ''}
            onChange={(e) => update({ status: e.target.value })}
          >
            {['Backlog', 'In Progress', 'Reviewing', 'Finished', 'On Hold'].map(
              (s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ),
            )}
          </Select>
        </FormControl>

        <Divider />

        {/* Dates */}
        <Typography variant="subtitle2" color="text.secondary">
          Dates
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <DatePicker
            label="Start Date"
            format="DD/MM/YYYY"
            value={project.startDate ? moment(project.startDate) : null}
            onChange={(date) => {
              if (date) update({ startDate: date.toISOString() });
            }}
            slotProps={{ textField: { size: 'small' } }}
          />
          <DatePicker
            label="End Date"
            format="DD/MM/YYYY"
            value={project.endDate ? moment(project.endDate) : null}
            onChange={(date) => {
              if (date) update({ endDate: date.toISOString() });
            }}
            slotProps={{ textField: { size: 'small' } }}
          />
        </Box>

        <Divider />

        {/* Managers */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Project Managers
          </Typography>
          <MemberList
            editable
            data={users}
            members={project.managers ?? []}
            onMembersChanged={(members) => {
              update({ managers: members.map((m) => m.id) });
            }}
          />
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={16} />
            <Typography variant="caption" color="text.secondary">
              Saving…
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default InfoPane;
