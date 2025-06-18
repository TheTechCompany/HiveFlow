import { Dialog, Button, DialogActions, DialogContent, DialogTitle, Autocomplete, TextField, Typography, Switch, Box, Tabs, Tab, IconButton, Checkbox, List, ListItem, ListItemButton, Divider, Paper } from "@mui/material"
import { DateTimePicker } from "@mui/x-date-pickers"
import moment from "moment";
import { useEffect, useState } from "react"
import { Add, Close } from '@mui/icons-material'
import { TasksView } from "./view/tasks";
import { PeopleView } from "./view/people";
import { SkillView } from "./view/skills";
import { gql, useMutation, useQuery } from "@apollo/client";
import { AvatarList } from "@hexhive/ui";
import { useAPIFunctions } from "../api";
import { stringToColor } from "@hexhive/utils";

export const SchedulingModal = (props: any) => {

    const [commentInput, setCommentInput] = useState<any>('');

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

    const { data } = useQuery(gql`
        query CommentQuery($id: ID){
            calendarItems(where: {ids: [$id]}){
                canEdit
                isOwner
                
                comments {
                    message
                    user {
                        name
                    }
                    createdAt
                }

                permissions {
                    user {
                        id
                        name
                    }
                }
                
                createdBy {
                    id
                    name
                }
            }
        }
    `, {
        variables: {
            id: schedule?.id
        }
    })

    const createdBy = data?.calendarItems?.[0]?.createdBy;
    const comments = data?.calendarItems?.[0]?.comments || [];

    const permissions = data?.calendarItems?.[0]?.permissions || [];

    const { commentOnCalendar, removeCommentOnCalendar, leaveCalendarItem, joinCalendarItem } = useAPIFunctions();
    
    const writeComment = () => {
        commentOnCalendar({
            variables: {
                id: schedule.id,
                message: commentInput
            }
        })
        // setSchedule({
        //     ...schedule,
        //     comments: [...(schedule.comments || []), commentInput]
        // })

        setCommentInput('')
    }

    const deleteComment = (ix: number) => {
        removeCommentOnCalendar({
            variables: {
                id: schedule?.id,
                comment: comments?.[ix]?.id
            }
        })
    }

    const skills = (props.tasks || []).reduce((prev, curr) => {

        const skillKeys = [...new Set(prev.map((x) => x.skill).concat((curr?.requiredSkills || []).map((x) => x.skill.skill)))]

        let skills = skillKeys?.map((x) => {
            return {
                skill: x,
                hours: parseFloat(prev.find((a) => a.skill == x)?.hours || 0) + parseFloat(curr?.requiredSkills?.find((a) => a.skill.skill == x).hours || 0)
            }
        })

        return skills
    }, [])

    const rowOptions = props.projects.map((x) => ({ ...x, project: true })).concat(
        props.estimates.map((x) => ({ ...x, project: false }))
    )

    const canEdit = () => {
        return props.selected?.id == null || data?.calendarItems?.[0]?.canEdit;
    }

    return (
        <Dialog
            fullWidth
            open={props.open}
            onClose={props.onClose}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>
                    {!canEdit() ? "View" : (props.selected?.id ? "Update" : "Create")} schedule
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AvatarList
                        size={20}
                        users={(permissions.map((x) => x.user).concat(createdBy ? [createdBy] : [])).map((x) => ({...x, color: stringToColor(x.id)}))}
                    />
                    {!data?.calendarItems?.[0]?.isOwner && 
                        <Button onClick={() => {
                            if(canEdit()){
                                leaveCalendarItem({
                                    variables: {
                                        id: schedule?.id
                                    }
                                })
                            }else{
                                joinCalendarItem({
                                    variables: {
                                        id: schedule?.id
                                    }
                                })
                            }
                        }} sx={{color: 'navigation.main'}} size="small">
                            {props.selected?.id && canEdit() ? "Leave" : "Join"}
                        </Button>
                    }
                </Box>
            </DialogTitle>
            <DialogContent sx={{
                display: 'flex',
                // maxHeight: '50vh',
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
                        options={rowOptions || []}
                        value={rowOptions?.find((a) => a.id == schedule.groupBy?.id) || null}
                        onChange={(e, newValue) => setSchedule({ ...schedule, groupBy: {id: newValue?.id} })}
                        groupBy={(option) => option.project ? 'Project' : 'Estimate'}
                        getOptionLabel={(option: any) => typeof (option) == 'string' ? option : `${option.displayId} - ${option.name}`}
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

                    <Box sx={{  }}>
                        {/* <Typography>Schedule</Typography>     */}
                        {view == 0 ? <PeopleView
                            horizon={{
                                start: schedule?.start,
                                end: schedule?.end
                            }}
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
                    {schedule?.id && <>
                        <Typography fontWeight={"bold"}>Comments</Typography>


                        <TextField
                            size="small"
                            value={commentInput || ''}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (!e.shiftKey && e.key == 'Enter') {
                                    e.preventDefault();
                                    writeComment()
                                    e.stopPropagation();
                                }
                            }}
                            placeholder="Write a comment"
                            multiline />

                        <Box sx={{ display: 'flex' }}>
                            <Button onClick={writeComment} variant="contained" color="primary">Comment</Button>
                        </Box>
                    </>
                    }
                    <Divider />
                    <Box sx={{
                        paddingBottom: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}>
                        {comments?.map((comment, ix) => (
                            <Paper
                                elevation={3}
                                sx={{
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                <Box sx={{ flex: 1, flexDirection: 'column' }}>
                                    <Typography>{comment.message}</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography fontSize={12}>{comment.user?.name} - {moment(comment.createdAt).format('hh:mma DD/MM')}</Typography>
                                        {/* <Typography fontSize={12}></Typography> */}

                                    </Box>
                                </Box>
                                <IconButton onClick={() => deleteComment(ix)}><Close /></IconButton>
                            </Paper>
                        ))}
                    </Box>


                </Box>
            </DialogContent>
            <DialogActions sx={{
                display: 'flex',
                justifyContent: props.selected?.id ? "space-between" : 'flex-end'
            }}>
                {props.selected?.id && canEdit() && <Button variant="contained" color="error" onClick={props.onDelete}>Delete</Button>}
                <Box sx={{display: 'flex'}}>
                    <Button onClick={props.onClose}>Cancel</Button>
                    {canEdit() && <Button onClick={submit} variant="contained">Save</Button>}
                </Box>
            </DialogActions>
        </Dialog>
    )
}