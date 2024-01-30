import React, { ReducerAction } from 'react';

import { useState } from 'react';
import { ReduceCapacity, Notes, Add, Close } from '@mui/icons-material'
import moment from 'moment';
import { useEffect } from 'react';
import { ColorDot, DateInput } from '@hexhive/ui';
import { DatePicker } from '@mui/x-date-pickers';
import { CapacityItem } from './CapacityItem';
import { CapacityTab } from './tabs/capacity'
import { NoteTab } from './tabs/notes'
import { Autocomplete, Box, Dialog, Button, TextField, Typography, DialogContent, DialogActions, DialogTitle, IconButton, Divider, Paper } from '@mui/material';

export interface TimelineModalProps {
    open: boolean;
    type: "Projects" | "People" | "Estimates",
    selected?: any;
    onClose?: () => void;
    onDelete?: () => void;
    projects?: {
        displayId: string;
        id?: string | null;
        name?: string | null;
        type?: string;
    }[]
    onSubmit?: (plan: {
        project?: { id?: string, type?: string },
        startDate?: Date,
        endDate?: Date,
        notes?: string,
        data?: {
            location?: string;
            item?: string;
            quantity?: number;
        }[]
    }) => void;
}

const tab_options = [<ReduceCapacity />, <Notes />]

export const TimelineModal: React.FC<TimelineModalProps> = (props) => {

    const [tab, setTab] = useState<number>(0);

    const [plan, setPlan] = useState<{
        project?: string,
        estimate?: string,
        startDate?: string,
        endDate?: string,
        notes?: string,
        data?: {
            [key: string]: any;
            location: string;
            item: string;
            quantity?: number;
        }[]

    }>({ data: [], startDate: '', endDate: '' })

    useEffect(() => {
        console.log({ selected: props.selected })
        setPlan(props.selected ? {
            ...Object.assign({}, props.selected),
            project: props.selected?.project?.id,
            estimate: props.selected?.estimate?.id,
            startDate: new Date(props.selected?.startDate)?.toISOString(),
            endDate: new Date(props.selected?.endDate)?.toISOString(),
        } : { items: [] })
    }, [props.selected])

    const [search, setSearch] = useState<string>('')

    const onClose = () => {
        props.onClose?.();
        setSearch('');
        setPlan({ data: [] })
    }

    const onDelete = () => {
        props.onDelete?.();
        // onClose();
    }

    const onSubmit = () => {
        let submit_plan = {
            ...plan,
            project: {
                type: props.projects?.find((a) => a.id == plan.project)?.type,
                id: plan.project
            },
            startDate: new Date(moment(plan.startDate).set('hours', 0).valueOf()),
            endDate: new Date(moment(plan.endDate).set('hours', 24).valueOf())
        }

        props.onSubmit?.(submit_plan);
        setPlan({ data: [] })
        setSearch('');
    }

    const addCapacityItem = () => {
        let items = plan.data?.slice() || [];

        items.push({ item: '', location: '', quantity: 0 })
        setPlan({ ...plan, data: items })
    }

    const removeCapacityItem = (ix: number) => {
        let items = plan.data?.slice() || [];

        items.splice(ix, 1);
        setPlan({ ...plan, data: items })
    }

    const updateCapacityItem = (ix: number, field: string, value: any) => {
        let items = plan.data?.slice() || []
        items[ix] = Object.assign(items[ix], { [field]: value });
        setPlan({ ...plan, data: items })
    }

    const updateNotes = (e: any) => {
        setPlan({ ...plan, notes: e.target.value })
    }


    const renderTab = () => {
        switch (tab) {
            case 0:
                return (
                    <CapacityTab
                        addCapacityItem={addCapacityItem}
                        plan={plan}
                        removeCapacityItem={removeCapacityItem}
                        updateCapacityItem={updateCapacityItem}
                        type={props.type} />
                );
            case 1:
                return (
                    <NoteTab
                        notes={plan.notes}
                        updateNotes={updateNotes} />
                )
        }
    }

    console.log({plan, projects: props.projects})

    return (
        <Dialog
            maxWidth="md"
            fullWidth
            open={props.open}
            onClose={onClose}>
            <DialogTitle>
                Capacity Plan
            </DialogTitle>
            <DialogContent>



                {/* Content */}
                <Box sx={{marginTop: '6px'}}>
                    {(props.type == "Projects" || props.type == "Estimates") && <Box >

                        <Autocomplete
                            size='small'
                            value={props.projects?.find((a) => a.id == plan?.project || a.id == plan?.estimate) || ''}

                            disablePortal
                            onChange={(event, value) => {
                                console.log({ event, value })
                                setPlan({
                                    ...plan,
                                    project: value.id
                                })
                            }}
                            getOptionLabel={(option: any) => {
                                console.log({ option })
                                return `${option.displayId} - ${option.name}`
                            }}
                            renderOption={(props, option) => {
                                return (
                                    <li {...props}>
                                        <ColorDot color={option.type == "Project" ? '#A3B696' : '#edc25c'} size={10} />
                                        {option.displayId} - {option.name}
                                    </li>
                                )
                            }}
                            options={props.projects || []}
                            renderInput={(params) => <TextField color='primary' size='small' {...params} label="Project" />} />
                        {/*                             
                            <Text alignSelf="start" size="small">Project</Text>
                            <Select
                                onSearch={(searchString) => { setSearch(searchString) }}
                                onChange={({option}) => { setPlan({ ...plan, project: option.id }) }}
                                value={plan.project}
                                labelKey={(item) => item.displayId + ' - ' + item.name}
                                valueKey={{key: "id", reduce: true}}
                                options={props.projects?.filter((a) => !search || `${a.displayId} - ${a.name}`.indexOf(search) > -1) || []}>
                                {(option) => (
                                    <Box pad="small" direction="row" align="center">
                                        <ColorDot color={option.type == "Project" ? '#A3B696': '#edc25c'} size={10}/>
                                        <Text>{option.displayId} - {option.name}</Text>
                                    </Box>
                                )}
                            </Select> */}
                    </Box>}
                    <Box sx={{display: 'flex', marginTop: '6px', marginBottom: '6px', '&>*': {flex: 1}}}>
                            <DatePicker
                                label="Start Date"
                                value={moment(plan.startDate)}
                                slotProps={{
                                    textField: {
                                        size: 'small'
                                    }
                                }}
                                onChange={(value) => {
                                    // let startDate = new Date(value.toLocaleString());
                                    // let v = moment(value).format('dd/mm/yyyy').toString()
                                    let startDate = moment(value).set('hours', 0).set('minutes', 0).toLocaleString();

                                    try {
                                        setPlan({ ...plan, startDate })
                                    } catch (e) {

                                    }
                                }}
                                format="DD/MM/YYYY" />

                        {/*
                                   // (plan.startDate && !isNaN(+plan.startDate))? 
                                    //     (plan.startDate instanceof Date) ? plan.startDate?.toISOString() : plan.startDate || '' 
                                    //     : new Date().toISOString()
                                    // }

                                     value instanceof Date ? value : new Date(value as string)
                            */}
                            <DatePicker
                                label='End Date'
                                value={moment(plan.endDate)}
                                slotProps={{
                                    textField: {
                                        size: 'small'
                                    }
                                }}
                                onChange={( value ) => {
                                    // let v = moment(value).format('dd/mm/yyyy')
                                    // console.log({value: value.toString(), d: new Date(value.toLocaleString()).toUTCString(), valueLocale: value.toLocaleString()})
                                    let endDate = moment(value).set('hours', 23).set('minutes', 59).toLocaleString();
                                    
                                    try {
                                        setPlan({ ...plan, endDate })
                                    } catch (e) {

                                    }
                                }}
                                format="DD/MM/YYYY" />
                    </Box>
                    <Divider />

                    <Box sx={{marginTop: '4px', display: 'flex'}}>
                        <Paper sx={{ bgcolor: 'secondary.main', display: 'flex', flexDirection: 'column'}}>
                            {tab_options.map((x, ix) => <IconButton onClick={() => setTab(ix)} sx={{background: ix==tab ? '#dfdfdf': undefined}}>{x}</IconButton>)}

                        </Paper>
                        <Box
                            sx={{
                                display: 'flex',
                                flex: 1,
                                minHeight: '30vh',
                                maxHeight: '40vh'
                            }}>

                            {renderTab()}


                        </Box>
                    </Box>
                </Box>

            </DialogContent>
            <DialogActions>
                {/* Actions */}
                {props.selected?.id ? (<Button color="error" onClick={onDelete}>Delete</Button>) : null}
                <Button onClick={onClose}>Close</Button>
                <Button color="primary" variant="contained" onClick={onSubmit}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}