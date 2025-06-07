import { FormControl, FormInput } from '@hexhive/ui';
import { DatePicker } from '@mui/x-date-pickers';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, Button, Autocomplete, Divider, InputAdornment } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { createFilterOptions } from '@mui/material/Autocomplete';
import moment from 'moment';
import { stringToColor } from '@hexhive/utils';

const filter = createFilterOptions<ProjectStatusOption>();

export interface Project {
    id?: string;
    displayId?: string;
    name?: string;
    colour?: string;
    description?: string;
    status?: string;

    startDate?: Date;
    endDate?: Date;
}

interface ProjectStatusOption {
    text: string;
    inputValue?: string;
}

export interface ProjectModalProps {
    open: boolean;
    selected?: Project;

    error?: any;

    statusList?: string[];

    onClose?: () => void;
    onSubmit?: (project: Project) => void;
    onDelete?: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = (props) => {
    const [project, setProject] = useState<Project>({})

    const [projectStatusList, setProjectStatusList] = useState<ProjectStatusOption[]>((props.statusList || []).map((x) => ({text: x})));

    useEffect(() => {
        //...(projectStatusList.map((x) => x.text)),
        setProjectStatusList((projectStatusList) => 
            Array.from(new Set([  ...props.statusList ])).map((x) => ({text: x}))
        )
    }, [props.statusList])

    const defaultColour = stringToColor(`${project.id} - ${project.name}`)

    const submit = () => {
        props.onSubmit({
            ...project,
            startDate: (project?.startDate as any)?.toDate(),
            endDate: (project?.endDate as any)?.toDate(),
            colour: project.colour || defaultColour
        })
    }

    useEffect(() => {
        console.log(props.selected)
        setProject({ 
            ...props.selected,
            startDate: props.selected?.startDate ? moment(props.selected?.startDate) : undefined,
            endDate: props.selected?.endDate ? moment(props.selected?.endDate) : undefined
        } as any)
    }, [props.selected])

    return (
        <Dialog
            fullWidth
            open={props.open}
            onClose={props.onClose}>
            <DialogTitle>{`${props.selected ? 'Update' : 'Create'} Project`}</DialogTitle>
            <DialogContent>
                <Box sx={{ marginTop: '6px' }}>

                    <TextField
                        size="small"
                        fullWidth
                        disabled={props.selected?.id != null}
                        error={(props.error?.displayId && props.error?.displayId == project?.displayId)}
                        helperText={(props.error?.displayId && props.error?.displayId == project?.displayId) ? "Duplicate Job ID" : null}
                        value={project.displayId || null}
                        sx={{ marginBottom: '6px' }}
                        onChange={(e) => setProject({ ...project, displayId: e.target.value?.trim() })}
                        label='ID' />

                    <TextField
                        size="small"
                        fullWidth
                        value={project.name || null}
                        sx={{ marginBottom: '6px' }}
                        onChange={(e) => setProject({ ...project, name: e.target.value })}
                        label='Name' />

                    <Box sx={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <TextField
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <Box sx={{background: project.colour || defaultColour, width: '30px', height: "30px", }} />
                            </InputAdornment>
                        }}
                        size="small"
                        fullWidth
                        value={project.colour || defaultColour || null}
                        sx={{ marginBottom: '6px' }}
                        onChange={(e) => setProject({ ...project, colour: e.target.value })}
                        label='Colour' />
                    </Box>

                    <Autocomplete
                        sx={{ marginBottom: '6px' }}
                        options={projectStatusList}
                        // freeSolo
                        onChange={(ev, newValue) => {
                            console.log({newValue})
                            if (typeof newValue === 'string') {
                                setProject({ ...project, status: newValue })
                            } else if (newValue && newValue.inputValue) {
                                setProjectStatusList([...projectStatusList, {text: newValue.inputValue}])
                                setProject({...project, status: newValue.inputValue})
                            } else {
                                setProject({ ...project, status: newValue?.text })
                            }
                        }}
                        filterOptions={(options, params) => {
                            const filtered = filter(options, params);

                            if (params.inputValue !== '' && filtered.map((x) => x.text.toLowerCase() == params.inputValue.toLowerCase()).indexOf(true) < 0) {
                                filtered.push({
                                    inputValue: params.inputValue,
                                    text: `Add "${params.inputValue}"`,
                                });
                            }

                            return filtered;
                        }}
                        getOptionLabel={(option) => {
                            // e.g. value selected with enter, right from the input
                            if (typeof option === 'string') {
                                return option;
                            }
                            // if (option.inputValue) {
                            //     return option.inputValue;
                            // }
                            return option.text;
                        }}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        value={projectStatusList?.find((a) => a.text == project?.status) || null}
                        renderInput={(params) => <TextField {...params} size="small" label="Status" />}
                    />

                    <Box sx={{ display: 'flex' }}>
                        <DatePicker
                            value={project?.startDate || null}
                            onChange={(start: any) => setProject({ ...project, startDate: start })}
                            format='DD/MM/YYYY'
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    size: 'small'
                                }
                            }}
                            label="Start Date" />
                        <DatePicker
                            value={project?.endDate || null}
                            onChange={(end: any) => setProject({ ...project, endDate: end })}
                            format='DD/MM/YYYY'
                            minDate={project?.startDate}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    size: 'small'
                                }
                            }}
                            label="End Date" />
                    </Box>
                    <Divider sx={{ marginTop: '12px', marginBottom: '12px' }} />

                    <TextField
                        fullWidth
                        multiline
                        value={project?.description || null}
                        onChange={(e) => setProject({ ...project, description: e.target.value })}
                        label="Description" minRows={4} />

                </Box>
            </DialogContent>
            <DialogActions sx={{ display: 'flex', alignItems: 'center', justifyContent: props.selected ? 'space-between' : 'flex-end' }}>
                {props.selected ? <Button color="error" onClick={props.onDelete}>Delete</Button> : null}
                <Box sx={{ display: "flex" }}>
                    <Button onClick={props.onClose}>Close</Button>
                    <Button variant='contained' color='primary' onClick={submit}>{props.selected ? "Save" : "Create"}</Button>
                </Box>
            </DialogActions>
        </Dialog>
    )
}