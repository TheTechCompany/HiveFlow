import React from 'react';
import { Box, IconButton, Paper, TextField } from '@mui/material';
import { FormControl } from '@hexhive/ui';
import { Maybe } from '@hive-flow/api';
import { Add } from '@mui/icons-material';

export interface HeaderProps {
    jobs?: Maybe<{
        status?: Maybe<string>;
    }>[]
    onCreate?: () => void;
    filter?: {search?: string, status?: string};
    onFilterChange?: (filter: {search?: string, status?: string}) => void;

    statusList?: string[]
}

export const Header : React.FC<HeaderProps> = (props) => {
    return (
        <Paper
            sx={{
                padding: '3px',
                display: 'flex',
                height: '50px',
                alignItems: 'center',
            }}
        >
        <Box 
            sx={{ flex: 1, marginRight: '6px', background: '#ffffff42', borderRadius: '6px' }}>
        <TextField
            variant='filled'
            size="small"
            fullWidth
            value={props.filter?.search}
            onChange={(e) => props.onFilterChange?.({search: e.target.value, status: props.filter?.status})}
            label="Search Projects..." />
        </Box>
        <Box 
            sx={{ minWidth: '200px', background: '#ffffff42', borderRadius: '6px' }}>
        <FormControl  
            labelKey='label'
            valueKey='id'
            fullWidth
            value={props.filter?.status}
            onChange={({option}) => props.onFilterChange?.({search: props.filter?.search, status: option })}
            placeholder="Status"
            options={["All"].concat(props.statusList).map((x) => ({id: x, label: x}))} 
            />
        </Box>
        {props.onCreate && (
            <IconButton onClick={props.onCreate} size="small" sx={{ padding: '6px', borderRadius: '3px' }}><Add /></IconButton>
        )}
      </Paper>
    )
}