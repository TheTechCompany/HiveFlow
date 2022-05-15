import React from 'react';
import { Box, TextInput, Select, Button } from 'grommet'
import { Add } from '@mui/icons-material';

export interface StaffSearchHeaderProps {

    filter?: string;
    onFilterChange?: (filter: string) => void;

    onCreate?: () => void;
}

export const StaffSearchHeader : React.FC<StaffSearchHeaderProps> = (props) => {
    return (
        <Box
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
            background="#ffffff42"
            flex round="xsmall">

        <TextInput 
            value={props.filter}
            onChange={(e: any) => props.onFilterChange?.(e.target.value)}
          focusIndicator={false}
          plain
          placeholder="Search People..." />
        
      </Box>        
      {props.onCreate && (
          <Button onClick={props.onCreate} hoverIndicator plain style={{padding: 6, borderRadius: 3}} icon={<Add />} />
        )}
       
      </Box>

    )
}