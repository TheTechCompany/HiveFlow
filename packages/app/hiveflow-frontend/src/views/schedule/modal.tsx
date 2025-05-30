import { Dialog, Button, DialogActions, DialogContent, DialogTitle, Autocomplete, TextField, Typography, Switch, Box } from "@mui/material"
import { DateTimePicker } from "@mui/x-date-pickers"
import moment from "moment";
import { useEffect, useState } from "react"

export const SchedulingModal = (props: any) => {

    const [ schedule, setSchedule ] = useState<any>({});

    useEffect(() => {
        setSchedule({
            ...props.selected
        })
    }, [props.selected])

    const submit = () => {
        props.onSubmit?.(schedule)
    }

    console.log("SCHEDULE", {schedule})

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
                    <Box sx={{display: 'flex'}}>
                        <DateTimePicker 
                            value={moment(schedule?.start) || null}
                            onChange={(e) => setSchedule({...schedule, start: e.toDate()})}
                            format="DD/MM/YYYY"
                            slotProps={{textField: {fullWidth: true, size: 'small'}}} />
                        <DateTimePicker  
                            value={moment(schedule?.end) || null}
                            onChange={(e) => setSchedule({...schedule, start: e.toDate()})}
                            format="DD/MM/YYYY"
                            slotProps={{textField: {fullWidth: true, size: 'small'}}}/>
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