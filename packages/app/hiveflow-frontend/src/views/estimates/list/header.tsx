import React from 'react';
import { Box, TextInput, Select, Button } from 'grommet'
import { Maybe } from '@hive-flow/api';
import { Add } from 'grommet-icons';

export interface QuoteHeaderProps {
    quotes?: any[]
    filter?: {search?: string, status?: string};
    onFilterChange?: (filter: {search?: string, status?: string}) => void;

    onCreate?: () => void;
}

export const QuoteHeader : React.FC<QuoteHeaderProps> = (props) => {
    return (
        <Box
        pad={{horizontal: 'xsmall'}}
        align="center"
        margin={{bottom: 'xsmall'}}
        round="xsmall"
        height="50px"
        direction="row"
        gap="xsmall"
        background="accent-1"
        >
        <Box
            flex
            round="xsmall"
            background="#ffffff42">
  <TextInput 
            value={props.filter?.search}
            onChange={(e: any) => props.onFilterChange?.({search: e.target.value})}
          focusIndicator={false}
          plain
          placeholder="Search Estimates..." />
        </Box>
      <Box 
        round="xsmall"
        background="#ffffff42"
        >

        <Select  
            value={props.filter?.status}
            onChange={({option}) => props.onFilterChange?.({search: props.filter?.search, status: option })}
          plain
          placeholder="Status"
          options={["All"].concat(Array.from(new Set(props.quotes?.filter((a) => a != undefined).map((x: any) => x.status || ''))))} 
          />
        </Box>

        {props.onCreate && (
          <Button onClick={props.onCreate} hoverIndicator plain style={{padding: 6, borderRadius: 3}} icon={<Add />} />
        )}
       
      </Box>
    )
}