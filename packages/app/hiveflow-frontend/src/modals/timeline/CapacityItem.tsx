import { Box, Button, Select, TextInput } from 'grommet';
import React from 'react';
import { Close } from '@mui/icons-material'

export interface CapacityItemProps {
    type: "Projects" | "People" | "Estimates";

    item: any | {item: string, location: string, quantity: any} ;
    updateCapacityItem: (key: string, value: any) => void;
    removeCapacityItem: () => void;
}  

export const CapacityItem : React.FC<CapacityItemProps> = (props) => {
    return (
        <Box height={{min: '45px'}} align="center" direction="row">
        <Box flex>
             <Select
                onChange={({option}) => props.updateCapacityItem('item', option)}
                value={props.item.item}
                placeholder="Type"
                options={["Welder", "Fabricator", "Skilled Labourer", "Civil Subcontractor", "TA"]} />
        </Box>
        <Box flex>
            <Select 
                value={props.item.location}
                onChange={({option}) => props.updateCapacityItem('location', option)}
                placeholder="Location"
                options={["Site", "Workshop"]} />
        </Box>
        <Box flex>
            <TextInput  
                type="number"
                value={props.item.quantity}
                onChange={(e) => props.updateCapacityItem('quantity', parseFloat(e.target.value))}
                placeholder={props.type == "Projects" ? "Estimated hours" : "People"} />
        </Box>
        <Button onClick={() => props.removeCapacityItem()} icon={<Close sx={{color: 'red'}} fontSize="small" />} />
    </Box>
    );
}