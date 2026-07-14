import React from 'react';
import { Add } from '@mui/icons-material';
import { Paper, IconButton, Box, TextField } from '@mui/material';

export interface StaffSearchHeaderProps {

    filter?: string;
    onFilterChange?: (filter: string) => void;

    onCreate?: () => void;
}

export const StaffSearchHeader : React.FC<StaffSearchHeaderProps> = (props) => {
    return (
        <Paper
            sx={{
                display: 'flex',
                height: '50px',
                alignItems: 'center',
                padding: '3px'
            }}>
        <Box
            sx={{flex: 1}}>

        <TextField 
            variant='filled'
            size="small"
            fullWidth
            value={props.filter}
            onChange={(e: any) => props.onFilterChange?.(e.target.value)}
          label="Search People..." />
        
      </Box>        
      {props.onCreate && (
          <IconButton onClick={props.onCreate}  >
            <Add />
          </IconButton>
        )}
       
      </Paper>

    )
}