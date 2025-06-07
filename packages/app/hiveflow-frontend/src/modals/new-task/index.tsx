import React, { useEffect, useRef, useState } from 'react'
import { Add, Close } from '@mui/icons-material'
import { Autocomplete, Box, Button, CircularProgress, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Menu, MenuItem, Paper, Popover, TextField, Typography } from '@mui/material'
import { FormControl } from '@hexhive/ui'
import { MemberList } from './members'
import { DatePicker } from '@mui/x-date-pickers'
import moment from 'moment'

export const TaskModal = (props) => {

    const [skillRef, setSkillRef] = useState(null);

    const [ loading, setLoading ] = useState(false);

    const [ deleteLoading, setDeleteLoading ] = useState(false)

    const [ task, setTask ] = useState<{
        title?: string;
        description?: string;
        status?: string;
        members?: string[];
        requiredSkills?: any;
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
        try{
            await props.onDelete?.();
            setTask({
                status: 'Backlog',
                startDate: new Date(),
                endDate: new Date()
            })
            setDeleteLoading(false);
        }catch(err){
            setDeleteLoading(false);
            //setError(true);
        }
    }

    const submit = async () => {
        setLoading(true);
        try{
            await props.onSubmit?.(task);
            setTask({
                status: 'Backlog',
                startDate: new Date(),
                endDate: new Date()
            });
            setLoading(false)
        }catch(err){
            setLoading(false);
            //setError(true);
        }
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
            <DialogContent sx={{display: 'flex', gap: '8px', position: 'relative'}}>

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

                    {task.requiredSkills ? (
                        <Box>
                            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Typography>Skills</Typography>
                                <IconButton
                                    onClick={() => {
                                        setTask({
                                            ...task,
                                            requiredSkills: [...task.requiredSkills, {}]
                                        })
                                    }}
                                    size="small"><Add /></IconButton>
                            </Box>
                            {task.requiredSkills?.map((skill, ix) => (
                                <Box sx={{display: 'flex'}}>
                                    <Autocomplete
                                        fullWidth
                                        value={skill.skill}
                                        onChange={(e, newValue) => {
                                            let requiredSkills = task.requiredSkills.slice();
                                            requiredSkills[ix].skill = newValue
                                            setTask({
                                                ...task, 
                                                requiredSkills
                                            })
                                        }}
                                        options={props.skills || []}
                                        getOptionLabel={(option) => typeof(option) == 'string' ? option : option.skill}
                                        renderInput={(params) => <TextField {...params} size="small" />}
                                        />
                                    <TextField 
                                        fullWidth
                                        value={skill.hours}
                                        onChange={(e) => {
                                            let requiredSkills = task.requiredSkills.slice();
                                            requiredSkills[ix].hours = e.target.value
                                            setTask({
                                                ...task, 
                                                requiredSkills
                                            })
                                        }}
                                        size="small" />
                                    <IconButton size="small" onClick={() => {
                                          let requiredSkills = task.requiredSkills.slice();
                                          requiredSkills.splice(ix, 1)
                                          setTask({
                                              ...task, 
                                              requiredSkills
                                          })
                                    }}>
                                        <Close />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    ) : null}
                </Box>
                <Box sx={{paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px'}}>

                    <Button 
                        variant="outlined"
                        sx={{textTransform: 'none'}}>Members</Button>
                    <Button 
                        // ref={skillRef}
                        onClick={(e) => {
                            setTask({...task, requiredSkills: []})
                        }}
                        variant={task.requiredSkills ? 'contained' : "outlined"}
                        sx={{textTransform: 'none'}}>Skills</Button>
                   
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