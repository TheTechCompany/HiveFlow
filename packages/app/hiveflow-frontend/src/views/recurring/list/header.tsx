import { Box, Button, Paper, TextField } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import React from 'react';

export interface ScheduleHeaderProps {
  onCreate?: () => void;
  search?: string;
  onSearchChange?: (search: string) => void;
}

export const ScheduleHeader: React.FC<ScheduleHeaderProps> = (props) => {
  return (
    <Paper sx={{ display: 'flex', alignItems: 'center', padding: '6px', gap: '8px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <TextField
          size="small"
          placeholder="Search schedules..."
          value={props.search || ''}
          onChange={(e) => props.onSearchChange?.(e.target.value)}
          variant="outlined"
          fullWidth
        />
      </Box>

      {props.onCreate ? (
        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={props.onCreate} sx={{ textTransform: 'none' }}>
          New Schedule
        </Button>
      ) : null}
    </Paper>
  );
};
