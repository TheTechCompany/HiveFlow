import React from 'react';
import { Add } from '@mui/icons-material';
import { Paper,Box, TextField, IconButton } from '@mui/material';

export interface PlantHeaderProps {

    filter?: string;
    onFilterChange?: (filter: string) => void;

    onCreate?: () => void;
}

export const PlantHeader : React.FC<PlantHeaderProps> = (props) => {
    return (
        <Paper
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '50px',
          padding: '3px'
        }}
      
        >
        <Box
            sx={{flex: 1, display: 'flex'}}>
        <TextField
          fullWidth
          variant='filled'
          size='small'
            value={props.filter}
            onChange={(e: any) => props.onFilterChange?.(e.target.value)}
          
          label="Search Equipment..." />
        </Box>
        {props.onCreate && (
          <IconButton onClick={props.onCreate}>
            <Add />
          </IconButton>
        )}
       
      </Paper>
    )
}