import { Box, Typography, Popover, List, ListItem, ListItemIcon, Checkbox } from '@mui/material';
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
            sx={{display: 'flex', bgcolor: 'primary.light', alignItems: 'center', justifyContent: 'space-between'}}>
            <Box sx={{ padding: '6px', minWidth: '200px', borderRadius: '6px' }}>

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
            <Box sx={{ borderRadius: '6px' }}>
                { true ? (
                     <IconButton onClick={props.onAdd}>
                        <Add />
                     </IconButton>
                ) : (
                    <>
                    <IconButton 
                        ref={targetRef}
                        onClick={() => {
                            openFilter(!filterOpen)
                        }}
                        size="small"
                        sx={{ padding: '6px' }}>
                        <Filter fontSize="small" />
                    </IconButton>
                    <Popover
                        open={filterOpen}
                        onClose={() => openFilter(false)}
                        anchorEl={targetRef.current}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                        <Box sx={{ padding: '6px' }}>
                            <Typography variant="body2">Filter</Typography>
                            <List dense>
                                {(props.filters || []).map((datum: any) => (
                                    <ListItem key={datum} button onClick={() => toggleFilter(datum)} sx={{ padding: '6px' }}>
                                        <ListItemIcon sx={{ minWidth: 'auto', marginRight: '6px' }}>
                                            <Checkbox
                                                size="small"
                                                onChange={() => toggleFilter(datum)}
                                                checked={(props.filter || []).indexOf(datum) > -1} />
                                        </ListItemIcon>
                                        <Typography variant="body2">{datum}</Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Popover>
                    
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