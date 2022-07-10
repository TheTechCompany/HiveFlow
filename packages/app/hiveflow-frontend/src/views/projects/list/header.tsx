import React from 'react';
import { Box, TextInput, Button } from 'grommet'
import { FormControl } from '@hexhive/ui';
import { Maybe } from '@hive-flow/api';
import { Add } from '@mui/icons-material';
import { Paper, TextField } from '@mui/material';

export interface HeaderProps {
    jobs?: Maybe<{
        status?: Maybe<string>;
    }>[]
    onCreate?: () => void;
    filter?: {search?: string, status?: string};
    onFilterChange?: (filter: {search?: string, status?: string}) => void;
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
            flex
            margin={{right: 'xsmall'}}
            background={'#ffffff42'}
            round="xsmall">
        <TextField
            variant='filled'
            size="small"
            value={props.filter?.search}
            onChange={(e) => props.onFilterChange?.({search: e.target.value, status: props.filter?.status})}
            label="Search Projects..." />
        </Box>
        <Box 
            width={{min: '200px'}}
            background={"#ffffff42"}
            round="xsmall">
        <FormControl  
            labelKey='label'
            valueKey='id'
            fullWidth
            value={props.filter?.status}
            onChange={({option}) => props.onFilterChange?.({search: props.filter?.search, status: option })}
            placeholder="Status"
            options={["All"].concat(Array.from(new Set(props.jobs?.map((x: any) => x.status || '')))).map((x) => ({id: x, label: x}))} 
            />
        </Box>
        {props.onCreate && (
            <Button onClick={props.onCreate} plain style={{padding: 6, borderRadius: 3}} icon={<Add />} hoverIndicator />
        )}
      </Paper>
    )
}