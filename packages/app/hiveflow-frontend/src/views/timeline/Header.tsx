import { Box, Text, Select, Button, Layer, Drop, List, CheckBox } from 'grommet';
import React, { useRef, useState } from 'react';
import { Add, FilterAlt as Filter } from '@mui/icons-material';
import styled from 'styled-components';
import { IconButton, Paper } from '@mui/material';
import { FormControl } from '@hexhive/ui';

export interface TimelineProps{
    timelines?: any[];
    
    onAdd?: () => void; 
    view?: TimelineView;
    onViewChange?: (view: string) => void;
    className?: string;

    filter?: string[]
    filters?: string[]

    onCreateTimeline?: () => void;
    onFilterChanged?: (filter: string[]) => void;
}

export interface TimelineView {
    id: string, 
    name: string
};

export const BaseTimelineHeader: React.FC<TimelineProps> = (props) => {
    console.log(props.view)
    const [ filterOpen, openFilter ] = useState<boolean>(false);
    const targetRef = useRef<any>(null);

    const toggleFilter = (id: string) => {
        let f = (props.filter || []).slice();

        if(f.indexOf(id) > -1){
            f.splice(f.indexOf(id), 1)
        }else{
            f.push(id)
        }
        props.onFilterChanged?.(f)
    }

    return (
        <Paper
            sx={{display: 'flex', bgcolor: 'secondary.main', alignItems: 'center', justifyContent: 'space-between'}}>
            <Box pad="xsmall" width={{min: '200px'}} round="xsmall">

                <FormControl    
                    
                    size="small"
                    placeholder="Timeline"
                    valueKey={'id'}
                    value={props.view}
                    onChange={(option) => {
                        console.log({option})
                        if(option == 'create'){
                            props.onCreateTimeline?.();
                        }else{
                            props.onViewChange?.(option)
                        }
                    }}
                    labelKey={'name'}
                    options={props.timelines}/>
            </Box>
            <Box  round="xsmall">
                { true ? (
                     <IconButton onClick={props.onAdd}>
                        <Add />
                     </IconButton>
                ) : (
                    <>
                    <Button 
                        ref={targetRef}
                        onClick={() => {
                            openFilter(!filterOpen)
                        }}
                        plain 
                        style={{padding: 6}} 
                        size="small" 
                        icon={<Filter fontSize="small" />} />
                    {filterOpen && 
                        <Drop
                            onEsc={() => openFilter(false)}
                            onClickOutside={() => openFilter(false)}
                            target={targetRef.current}
                            align={{right: 'right', top: 'top'}}
                            >
                            <Box>
                                <Text size="small">Filter</Text>
                                <List 
                                    onClickItem={({item}: any) => toggleFilter(item)}
                                    pad="xsmall"
                                    data={props.filters || []}>
                                    {(datum: any) => (
                                        <Box gap="xsmall" direction="row">
                                            <CheckBox 
                                                size={15} 
                                                onChange={(e) => {
                                                    toggleFilter(datum)
                                                    
                                                }}
                                                checked={(props.filter || []).indexOf(datum) > -1} />
                                            <Text size="small">{datum}</Text>
                                        </Box>
                                    )}
                                </List>
                            </Box>
                        </Drop>}
                    
                    </>
                    
                )}
            </Box>
        </Paper>
    );
}

export const TimelineHeader = styled(BaseTimelineHeader)`
    input {
        padding: 6px;
    }
`