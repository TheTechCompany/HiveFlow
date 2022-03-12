import React from 'react';
import { Box, TextInput, Select, Button } from 'grommet'
import { Add } from 'grommet-icons';

export interface PlantHeaderProps {

    filter?: string;
    onFilterChange?: (filter: string) => void;

    onCreate?: () => void;
}

export const PlantHeader : React.FC<PlantHeaderProps> = (props) => {
    return (
        <Box
        focusIndicator={false}
        align="center"
        pad={{horizontal: 'xsmall'}}
        margin={{bottom: 'xsmall'}}
        round="xsmall"
        height="50px"
        direction="row"
        background="accent-1"
        gap="xsmall"
        >
        <Box
            flex
            round="xsmall"
            background={'#ffffff42'}>
        <TextInput
        
            plain
            value={props.filter}
            onChange={(e: any) => props.onFilterChange?.(e.target.value)}
          focusIndicator={false}
          
          placeholder="Search Equipment..." />
        </Box>
        {props.onCreate && (
          <Button onClick={props.onCreate} hoverIndicator plain style={{padding: 6, borderRadius: 3}} icon={<Add />} />
        )}
       
      </Box>
    )
}