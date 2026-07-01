import { Box, Button, Paper, Select, TextField } from '@mui/material';
import React from 'react';

export interface BatchHeaderProps {
    onCreate?: () => void;
    filter?: { status?: string; search?: string };
    onFilterChange?: (filter: any) => void;
}

const BATCH_STATUSES = ['draft', 'in_review', 'approved', 'released'];

export const BatchHeader: React.FC<BatchHeaderProps> = (props) => {
    return (
        <Paper sx={{ display: 'flex', alignItems: 'center', padding: '6px', gap: '8px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', flex: 1 }}>
                <TextField
                    size="small"
                    placeholder="Search batches..."
                    value={props.filter?.search || ''}
                    onChange={(e) => props.onFilterChange?.({ ...props.filter, search: e.target.value })}
                />
                <Select
                    size="small"
                    value={props.filter?.status || 'All'}
                    onChange={(e) =>
                        props.onFilterChange?.({
                            ...props.filter,
                            status: e.target.value === 'All' ? undefined : e.target.value,
                        })
                    }
                    native>
                    <option value="All">All Statuses</option>
                    {BATCH_STATUSES.map((s) => (
                        <option key={s} value={s}>
                            {s.replace('_', ' ')}
                        </option>
                    ))}
                </Select>
            </Box>

            {props.onCreate ? (
                <Button variant="contained" color="primary" size="small" onClick={props.onCreate}>
                    New Batch
                </Button>
            ) : null}
        </Paper>
    );
};
