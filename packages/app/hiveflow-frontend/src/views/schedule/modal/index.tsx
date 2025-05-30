import { Dialog, Button, DialogActions, DialogContent, DialogTitle, Autocomplete, TextField, Typography, Switch, Box, Tabs, Tab, IconButton, Checkbox, List, ListItem, ListItemButton } from "@mui/material"
import { DateTimePicker } from "@mui/x-date-pickers"
import moment from "moment";
import { useEffect, useState } from "react"
import { Add } from '@mui/icons-material'
import { TasksView } from "./view/tasks";
import { PeopleView } from "./view/people";

export const SchedulingModal = (props: any) => {

    const [ schedule, setSchedule ] = useState<any>({});

    console.log({props})

    useEffect(() => {
        setSchedule({
            ...props.selected,
            people: props.selected?.data?.people
        })
    }, [props.selected])

    const submit = () => {
        props.onSubmit?.(schedule)
    }

    console.log(schedule.people)

    const [ view, setView ] = useState(0);

    return (
        <Dialog 
            fullWidth
            open={props.open} 
            onClose={props.onClose}>
            <DialogTitle sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Typography>
                Create schedule
                </Typography>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Typography>Plan</Typography>
                    <Switch size="small" color="info"/>
                </Box>
            </DialogTitle>
            <DialogContent sx={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Box sx={{
                    paddingTop: '8px',
                    flexDirection: 'column',
                    gap: '8px',
                    display: 'flex'
                }}>
                    <Autocomplete
                        options={props.projects || []}
                        value={props.projects?.find((a) => a.id == schedule.groupBy?.id) || null}
                        onChange={(e, newValue) => setSchedule({...schedule, groupBy: newValue})}
                        getOptionLabel={(option: any) => typeof(option) == 'string' ? option : option.name}
                        renderInput={(params) => <TextField {...params} label="Row" size="small" />} />
                    <Box sx={{display: 'flex', gap: '8px'}}>
                        <DateTimePicker 
                            value={moment(schedule?.start) || null}
                            onChange={(e) => setSchedule({...schedule, start: e.toDate()})}
                            format="DD/MM/YYYY"
                            slotProps={{textField: {fullWidth: true, size: 'small'}}} />
                        <DateTimePicker  
                            value={moment(schedule?.end) || null}
                            onChange={(e) => setSchedule({...schedule, end: e.toDate()})}
                            format="DD/MM/YYYY"
                            slotProps={{textField: {fullWidth: true, size: 'small'}}}/>
                    </Box>

                    <Box sx={{bgcolor: 'secondary.main'}}>
                        <Tabs value={view} onChange={(e, val) => setView(val)}>
                            
                            <Tab label="People" />
                            <Tab label="Tasks" />
                
                        </Tabs>
                    </Box>

                    <Box>
                        {/* <Typography>Schedule</Typography>     */}
                        {view == 0 ? <PeopleView people={props.people} /> : <TasksView tasks={props.tasks} />}
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


                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button onClick={submit} variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    )
}