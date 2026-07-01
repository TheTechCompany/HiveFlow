import React from 'react';
import { Maybe } from '@hive-flow/api';
import { Add } from '@mui/icons-material';
import { Box, IconButton, Paper, TextField } from '@mui/material';
import { FormControl } from '@hexhive/ui';

export interface QuoteHeaderProps {
    quotes?: any[]
    filter?: {search?: string, status?: string};
    onFilterChange?: (filter: {search?: string, status?: string}) => void;
  statusList?: string[];
    onCreate?: () => void;
}

export const QuoteHeader : React.FC<QuoteHeaderProps> = (props) => {
    return (
        <Paper
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '3px',
            height: '50px'
          }}
       
        >
        <Box
            sx={{ flex: 1, marginRight: '6px', borderRadius: '6px', background: '#ffffff42' }}>
      <TextField
          variant='filled'
          size="small"
            value={props.filter?.search}
            onChange={(e: any) => props.onFilterChange?.({search: e.target.value})}
          label="Search Estimates..." />
        </Box>
      <Box 
        sx={{ minWidth: '200px', borderRadius: '6px', background: '#ffffff42' }}
        >


        <FormControl  
            value={props.filter?.status}
            onChange={({option}) => props.onFilterChange?.({search: props.filter?.search, status: option })}
            labelKey="label"
            valueKey='id'
            placeholder="Status"
            options={["All"].concat(props.statusList).map((status) => ({id: status, label: status}))} 
          />
        </Box>

        {props.onCreate && (
          <IconButton onClick={props.onCreate} size="small" sx={{ padding: '6px', borderRadius: '3px' }}><Add /></IconButton>
        )}
       
      </Paper>
    )
}