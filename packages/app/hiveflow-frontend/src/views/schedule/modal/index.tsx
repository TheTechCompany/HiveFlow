import { Dialog, Button, DialogActions, DialogContent, DialogTitle, Autocomplete, TextField, Typography, Switch, Box, Tabs, Tab, IconButton, Checkbox, List, ListItem, ListItemButton, Divider, Paper } from "@mui/material"
import { DateTimePicker } from "@mui/x-date-pickers"
import moment from "moment";
import { useEffect, useState } from "react"
import { Add, Close } from '@mui/icons-material'
import { TasksView } from "./view/tasks";
import { PeopleView } from "./view/people";
import { SkillView } from "./view/skills";

export const SchedulingModal = (props: any) => {

    const [ commentInput, setCommentInput ] = useState<any>('');

    const [schedule, setSchedule] = useState<any>({});

    useEffect(() => {
        setSchedule({
            ...props.selected,
            tasks: props.selected?.data?.tasks,
            people: props.selected?.data?.people,
            comments: props.selected?.data?.comments
        })
    }, [props.selected])

    const submit = () => {
        props.onSubmit?.(schedule)
    }

    const [view, setView] = useState(0);

    const writeComment = () => {
        
        setSchedule({
            ...schedule,
            comments: [...(schedule.comments || []), commentInput]
        })

        setCommentInput('')
    }

    const deleteComment = (ix: number) => {
        let comments = schedule.comments.slice() || [];
        comments.splice(ix, 1);
        setSchedule({
            ...schedule,
            comments
        })
    }

    const skills = (props.tasks || []).reduce((prev, curr) => {

        const skillKeys = [...new Set(prev.map((x) => x.skill).concat((curr?.requiredSkills || []).map((x) => x.skill.skill)))]

        let skills = skillKeys?.map((x) => {
            return {
                skill: x,
                hours: parseFloat(prev.find((a) => a.skill ==  x)?.hours || 0) + parseFloat(curr?.requiredSkills?.find((a) => a.skill.skill == x).hours || 0)
            }
        })

        return skills
    }, [])

    return (
        <Dialog
            fullWidth
            open={props.open}
            onClose={props.onClose}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>
                    {props.selected?.id ? "Update" : "Create"} schedule
                </Typography>
                {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>Plan</Typography>
                    <Switch size="small" color="info" />
                </Box> */}
            </DialogTitle>
            <DialogContent sx={{
                display: 'flex',
                maxHeight: '50vh',
                // flexDirection: 'column',
            }}>
                {/* {schedule?.groupBy?.id && (
                    <Box>  
                        {skills.map((skill) => (
                            <Box>
                                {skill.skill} - {skill.hrs}
                            </Box>
                        ))}
                    </Box>
                )} */}
                <Box sx={{
                    flex: 1,
                    paddingTop: '8px',
                    flexDirection: 'column',
                    gap: '8px',
                    display: 'flex'
                }}>
                    <Autocomplete
                        options={props.projects || []}
                        value={props.projects?.find((a) => a.id == schedule.groupBy?.id) || null}
                        onChange={(e, newValue) => setSchedule({ ...schedule, groupBy: newValue })}
                        getOptionLabel={(option: any) => typeof (option) == 'string' ? option : option.name}
                        renderInput={(params) => <TextField {...params} label="Row" size="small" />} />
                    <Box sx={{ display: 'flex', gap: '8px' }}>
                        <DateTimePicker
                            label="Start date"
                            value={moment(schedule?.start) || null}
                            onChange={(e) => setSchedule({ ...schedule, start: e.toDate() })}
                            format="DD/MM/YYYY"
                            slotProps={{ textField: { fullWidth: true, size: 'small' } }} />
                        <DateTimePicker
                            label="End date"
                            value={moment(schedule?.end) || null}
                            onChange={(e) => setSchedule({ ...schedule, end: e.toDate() })}
                            format="DD/MM/YYYY"
                            slotProps={{ textField: { fullWidth: true, size: 'small' } }} />
                    </Box>

                    <Box sx={{ bgcolor: 'secondary.main' }}>
                        <Tabs value={view} onChange={(e, val) => setView(val)}>

                            <Tab label="People" />
                            <Tab label="Tasks" />
                            <Tab label="Capacity" />
                        </Tabs>
                    </Box>

                    <Box sx={{minHeight: '30vh'}}>
                        {/* <Typography>Schedule</Typography>     */}
                        {view == 0 ? <PeopleView
                            selected={schedule.people || []}
                            onSelect={(people) => {
                                setSchedule({
                                    ...schedule,
                                    people: people
                                })
                            }}
                            people={props.people} /> : view == 1 ? 
                            <TasksView
                                selected={schedule.tasks || []}
                                onSelect={(selected) => {
                                    setSchedule({
                                        ...schedule,
                                        tasks: selected
                                    })
                                }}
                                tasks={props.tasks} /> : 
                            <SkillView tasks={props.tasks} />}
                        {/* 
                        <Autocomplete
                            value={null}
                            onChange={(e, newValue) => {
                                setSchedule({
                                    ...schedule,
                                    people: [...(schedule.people || []), newValue]
                                })
                            }}
                            options={props.people || []}
                            getOptionLabel={(option: any) => typeof(option) == 'string' ? option : option.name}
                            renderInput={(params) => <TextField {...params} size="small" label="People" />}
                            />
                         */}

                    </Box>
                    <Divider />
                    <Typography fontWeight={"bold"}>Comments</Typography>


                    <TextField  
                        size="small"
                        value={commentInput || ''}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => {
                            if(!e.shiftKey && e.key == 'Enter') {
                                e.preventDefault();
                                writeComment()
                                e.stopPropagation();
                            }
                        }}
                        placeholder="Write a comment"
                        multiline/>

                    <Box sx={{ display: 'flex' }}>
                        <Button onClick={writeComment} variant="contained" color="primary">Comment</Button>
                    </Box>

                    <Divider />
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}>
                        {schedule?.comments?.map((comment, ix) => (
                            <Paper sx={{
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <Box sx={{flex: 1}}>
                                    <Typography>{comment}</Typography>
                                </Box>
                                <IconButton onClick={() => deleteComment(ix)}><Close /></IconButton>
                            </Paper>
                        ))}
                    </Box>


                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button onClick={submit} variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    )
}