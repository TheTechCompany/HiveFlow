import { Box } from 'grommet';
import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { Button as GButton } from 'grommet'

export interface ScheduleModalHeaderProps {
    projects?: {displayId: string, name: string}[]
    activeTab?: string;
    setActiveTab?: (tab: string) => void;

    item?: any;
    onChange?: (item: any) => void;
}

export const ScheduleModalHeader : React.FC<ScheduleModalHeaderProps> = (props) => {
    const menu = [
        'People',
        'Equipment',
        'Notes'
    ]

    return (
        <Box
            elevation='small'

            gap="xsmall"
            background={'accent-1'}
            width={'xlarge'}
        >

            <Box
                background={'neutral-1'}
                pad={{ top: "small", bottom: 'xsmall', horizontal: 'xsmall' }}>
                <Autocomplete
                    size='small'
                    value={props.item?.project}
                    
                    disablePortal
                    onChange={(event, value) => {
                        console.log({ event, value })
                        props.onChange({
                            ...props.item,
                            project: value
                        })
                    }}
                    getOptionLabel={(option: any) => `${option.displayId} - ${option.name}`}
                    renderOption={(props, option) => (<li {...props}>{option.displayId} - {option.name}</li>)}
                    options={props.projects || []}
                    renderInput={(params) => <TextField color='primary' size='small' {...params} label="Project" />} />
            </Box>


            {/* <Text size="small">Project</Text>
            <Select 
                plain
                value={item.project}
                onChange={({value}) => setItem({...item, project: value})}
                onSearch={(searchString) => setProjectSearchString(searchString)}
                valueKey={{key: 'id', reduce: true}}
                labelKey={(project) => `${project.displayId} - ${project.name}`}
                options={props.projects?.filter(filterProjects) }
                /> */}
            <Box
                pad={{ horizontal: 'xsmall', bottom: 'xsmall' }}
                flex
            >
                <Box
                    gap="xsmall"
                    background={'accent-1'}
                    direction='row'>
                    {menu.map((item) => (
                        <GButton
                            plain
                            active={props.activeTab === item.toLowerCase()}
                            style={{ padding: 6, borderRadius: 3, color: '#2b2b2b' }}
                            hoverIndicator
                            label={item}
                            onClick={() => props.setActiveTab(item.toLowerCase())} />
                    ))}

                </Box>

            </Box>


        </Box>
    )
}