import React, { useEffect, useState } from 'react'
import { Add } from '@mui/icons-material'
import { Box, Button, CircularProgress, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Paper, TextField, Typography } from '@mui/material'
import { FormControl } from '@hexhive/ui'
import { MemberList } from './members'
import { DatePicker } from '@mui/x-date-pickers'
import moment from 'moment'

export const TaskModal = (props) => {

    const [ loading, setLoading ] = useState(false);

    const [ deleteLoading, setDeleteLoading ] = useState(false)

    const [ task, setTask ] = useState<{
        title?: string;
        description?: string;
        status?: string;
        members?: string[];
        startDate?: Date;
        endDate?: Date;
        dependencyOn?: {title: string, status: string, endDate: Date}[];
        dependencyOf?: {title: string, status: string, endDate: Date}[];
    }>({
        status: 'Backlog',
        startDate: new Date(),
        endDate: new Date()
    });

    useEffect(() => {
        setTask({
            status: 'Backlog',
            startDate: new Date(),
            endDate: new Date(),
            ...props.selected,
            members: props.selected?.members?.map((x) => x.id)
        })
    }, [props.selected])

    const onDelete = async () => {
        setDeleteLoading(true);
        await props.onDelete?.();
        setTask({
            status: 'Backlog',
            startDate: new Date(),
            endDate: new Date()
        })
        setDeleteLoading(false);
    }

    const submit = async () => {
        setLoading(true);
        await props.onSubmit?.(task);
        setTask({
            status: 'Backlog',
            startDate: new Date(),
            endDate: new Date()
        });
        setLoading(false)
    }

    return (
        <Dialog 
            maxWidth="lg"
            onClose={props.onClose}
            open={props.open}>
            <DialogTitle>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Typography>Task</Typography>
                    <MemberList
                        data={props.users || []}
                        members={props.users.filter((a) => task.members?.indexOf(a.id) > -1) || []}
                        onMembersChanged={(members) => {
                            setTask({...task, members: members.map((x) => x.id)})
                        }}
                        />
                </Box>
            </DialogTitle>
            <DialogContent sx={{display: 'flex', position: 'relative'}}>

                {/* <Collapse in={task.dependencyOf?.length > 0 || task.dependencyOn?.length > 0} sx={{display: 'flex', flexDirection: 'column', padding: '3px', position: 'absolute', top: 0, bottom: 0, left: '-100%'}}>
                    {task.dependencyOn?.length > 0 && <Paper>
                        <Box sx={{padding: '3px', color: 'white', bgcolor: 'secondary.light'}}>
                            <Typography>Needs</Typography>
                        </Box>
                        <Divider />
                        <Box sx={{padding: '3px'}}>
                            {task.dependencyOn?.filter((a) => a.status != "Done" && a.status != "Reviewing").map((dependency) => (
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                {(new Date(dependency.endDate).getTime() < new Date().getTime()) ? <ColorDot size={8} color="red" /> : ""}
                                <Typography>{dependency.title}</Typography>
                                </Box>
                            )).map((x) => [x, <Divider />])}
                        </Box>
                    </Paper>}
                    {task.dependencyOf?.length > 0 && <Paper>
                        <Box sx={{padding: '3px', color: 'white', bgcolor: 'secondary.light'}}>
                            <Typography>Needed by</Typography>
                        </Box>
                        <Divider />
                        <Box sx={{padding: '3px'}}>
                            {task.dependencyOf?.filter((a) => a.status != "Done" && a.status != "Reviewing").map((dependency) => (
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    {(new Date(dependency.endDate).getTime() < new Date().getTime()) ? <ColorDot size={8} color="red" /> : ""}
                                    <Typography>{dependency.title}</Typography>
                                </Box>
                            )).map((x) => [x, <Divider />])}
                        </Box>
                    </Paper>}
                </Collapse> */}

                <Box sx={{display: 'flex', flex: 1, flexDirection: 'column'}}>
                    <TextField 
                        sx={{marginTop: '8px'}}
                        label="Title" 
                        fullWidth 
                        size="small"
                        value={task.title}
                        onChange={(e) => setTask({...task, title: e.target.value})}
                            />
                    <TextField 
                        sx={{marginTop: '8px', marginBottom: '8px'}}
                        multiline 
                        minRows={3}
                        label="Description" 
                        fullWidth 
                        value={task.description}
                        onChange={(e) => setTask({...task, description: e.target.value})}
                        size="small" />
                    
                    <FormControl
                        placeholder='Status'
                        value={task.status}
                        onChange={(val) => setTask({...task, status: val})}
                        labelKey='label'
                        valueKey='id'
                        options={["Backlog", "In Progress", "Reviewing", "Finished"].map((x) => ({id: x, label: x}))}
                            />

                    <Box sx={{marginTop: '8px', marginBottom: '3px', display: 'flex'}}>
                        <DatePicker 
                            format='DD/MM/YYYY'
                            value={task.startDate ? moment(task.startDate) : null}
                            onChange={(date) => {
                                    // console.log({date, old: '12'})
                                    setTask({...task, startDate: date.toDate() })

                            
                            }}
                            slotProps={{
                                textField: {
                                    size: 'small'
                                }
                            }}
                            label='Start Date' />
                        <DatePicker 
                            format='DD/MM/YYYY'
                            value={task.endDate ? moment(task.endDate) : null}
                            onChange={(date) => setTask({...task, endDate: date.toDate() })}
                            slotProps={{
                                textField: {
                                    size: 'small'
                                }
                            }}
                            label="End Date" />
                    </Box>

                </Box>
            </DialogContent>
            <DialogActions sx={{display: 'flex', justifyContent: props.selected?.id ? 'space-between' : undefined}}>
                {props.selected?.id &&  <Box>
                    <Button onClick={onDelete} disabled={deleteLoading} variant="contained" color="error">{deleteLoading ? <CircularProgress size="20px" /> : "Delete"}</Button>
                </Box>}
                <Box>
                    <Button onClick={props.onClose}>Close</Button>
                    <Button onClick={submit} disabled={loading} color="primary" variant="contained">{loading ? <CircularProgress size="20px" /> : "Save"}</Button>
                </Box>
            </DialogActions>
        </Dialog>
    )
}