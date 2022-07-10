import { Box, Button, IconButton, TextField } from '@mui/material';
import React from 'react';
import { Close } from '@mui/icons-material'
import { FormControl } from '@hexhive/ui';

export interface CapacityItemProps {
    type: "Projects" | "People" | "Estimates";

    item: any | {item: string, location: string, quantity: any} ;
    updateCapacityItem: (key: string, value: any) => void;
    removeCapacityItem: () => void;
}  

export const CapacityItem : React.FC<CapacityItemProps> = (props) => {
    return (
        <Box sx={{minHeight: '45px', display: 'flex', alignItems: 'center', padding: '3px'}}>
        <Box sx={{flex: 1}}>
             <FormControl
                fullWidth
                onChange={(option) => props.updateCapacityItem('item', option)}
                value={props.item.item}
                placeholder="Type"
                valueKey='id'
                labelKey='label'
                options={["Welder", "Fabricator", "Skilled Labourer", "Civil Subcontractor", "TA"].map((x) => ({id: x, label: x}))} />
        </Box>
        <Box sx={{flex: 1}}>
            <FormControl 
                fullWidth
                value={props.item.location}
                onChange={(option) => props.updateCapacityItem('location', option)}
                placeholder="Location"
                valueKey='id'
                labelKey='label'
                options={["Site", "Workshop"].map((x) => ({id: x, label: x}))} />
        </Box>
        <Box sx={{flex: 1}}>
            <TextField  
                size="small"
                type="number"
                fullWidth
                value={props.item.quantity}
                onChange={(e) => props.updateCapacityItem('quantity', parseFloat(e.target.value))}
                label={props.type == "Projects" ? "Estimated hours" : "People"} />
        </Box>
        <IconButton onClick={() => props.removeCapacityItem()}><Close color="error" /></IconButton>
    </Box>
    );
}