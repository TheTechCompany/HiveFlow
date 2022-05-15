import { Box, Text, Select, Button, Layer, Drop, List, CheckBox } from 'grommet';
import React, { useRef, useState } from 'react';
import { Add, FilterAlt as Filter } from '@mui/icons-material';
import styled from 'styled-components';

export interface TimelineProps{
    timelines?: any[];
    
    onAdd?: () => void; 
    view?: TimelineView;
    onViewChange?: (view: TimelineView) => void;
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
        <Box
            className={props.className}
            height="42px"
            round="xsmall"
            background="accent-1"
            pad={'xsmall'}
            direction="row"
            align="center"
            justify="between">
            <Box background="#ffffff42" round="xsmall">

                <Select
                    size="small"
                    placeholder="Timeline"
                    plain
                    labelKey={"name"}
                    valueKey={{key: 'id', reduce: true}}
                    value={props.view?.id}
                    onChange={({ option }) => {
                        if(option.id == 'create'){
                            props.onCreateTimeline?.();
                        }else{
                            props.onViewChange?.(option)
                        }
                    }}
                    options={(props.timelines || ["Projects", "People", "Estimates"].map((x) => ({name: x}))).concat([{id: 'create', name: "Create Timeline"}])}>
                    {(datum) => (
                        <Box
                            background={datum.id == 'create' ? '#dfdfdf' : undefined}
                            pad="xsmall"
                            direction='row'>
                            <Text>{datum.name}</Text>
                        </Box>
                    )}
                </Select>
            </Box>
            <Box background="#ffffff42" round="xsmall">
                { true ? (
                     <Button plain style={{padding: 6}} size="small" onClick={props.onAdd} icon={<Add fontSize="small" />} />
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
        </Box>
    );
}

export const TimelineHeader = styled(BaseTimelineHeader)`
    input {
        padding: 6px;
    }
`