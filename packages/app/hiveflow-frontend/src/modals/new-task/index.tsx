import React, { useEffect, useState } from 'react'

import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { DateInput, FormControl } from '@hexhive/ui'

export const TaskModal = (props) => {

    const [ loading, setLoading ] = useState(false);

    const [ deleteLoading, setDeleteLoading ] = useState(false)

    const [ task, setTask ] = useState<{
        title?: string;
        description?: string;
        status?: string;
        startDate?: Date;
        endDate?: Date;
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
            ...props.selected
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
            maxWidth="md"
            onClose={props.onClose}
            open={props.open}>
            <DialogTitle>Task</DialogTitle>
            <DialogContent sx={{display: 'flex', flexDirection: 'column'}}>
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
                    options={["Backlog", "In Progress", "Review", "Done"].map((x) => ({id: x, label: x}))}
                        />

                <Box sx={{marginTop: '8px', display: 'flex'}}>
                    <DateInput 
                        format='dd/MM/yyyy'
                        value={task.startDate?.toISOString()}
                        onChange={(date) => setTask({...task, startDate: new Date(date)})}
                        label='Start Date' />
                    <DateInput 
                        format='dd/MM/yyyy'
                        value={task.endDate?.toISOString()}
                        onChange={(date) => setTask({...task, endDate: new Date(date)})}
                        label="End Date" />
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