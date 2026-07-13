import React from 'react';
import { Autocomplete, Box, IconButton, TextField } from '@mui/material';
import { ExitToApp } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom';

export interface ScheduleModalHeaderProps {
    projects?: {displayId: string, name: string}[]
    activeTab?: string;
    setActiveTab?: (tab: string) => void;

    item?: any;
    onChange?: (item: any) => void;
}

export const ScheduleModalHeader : React.FC<ScheduleModalHeaderProps> = (props) => {
    const navigate = useNavigate();

    return (
 

            <Box
                sx={{marginTop: '6px', marginBottom: '6px', display: 'flex', alignItems: 'center'}}>
                <Box sx={{flex: 1, paddingLeft: '6px'}}>
                    <Autocomplete
                        color='white'
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
                <IconButton 
                    onClick={() => navigate(`/projects/${props.item?.project?.displayId}`)}>
                    <ExitToApp />
                </IconButton>
            </Box>
          


    )
}