import { Badge, Box, Checkbox, CircularProgress, CircularProgressProps, List, ListItem, ListItemButton, TextField, Typography } from "@mui/material"
import moment from "moment";
import { useEffect, useState } from "react"
import { useRootSchedule } from "../../context";

export const PeopleView = (props: any) => {

    const { events } = useRootSchedule();

    const [ selected, setSelected ] = useState<any>([]);

    useEffect(() => {
        setSelected(props.selected)
    }, [props.selected])

    const onLeave = (person: any) => {
        return person.leave?.filter((leave_item) => {
            return new Date(leave_item?.start)?.getTime() < new Date(props.horizon?.end)?.getTime() && new Date(leave_item?.end)?.getTime() > new Date(props?.horizon?.start)?.getTime()
        }).length == 0
    }

    const getAvailability = (person: any) => {
        const overlappedLeave = person?.leave?.filter((leave_item) => {
            return new Date(leave_item?.start)?.getTime() < new Date(props.horizon?.end)?.getTime() && new Date(leave_item?.end)?.getTime() > new Date(props.horizon?.start)?.getTime()
        })

        const totalLeave = overlappedLeave.reduce((prev, curr) => {
            let start = curr.start > props.horizon.start ? curr.start : props.horizon.start;
            let end = curr.end < props.horizon.end ? curr.end : props.horizon.end;

            return prev + moment(end).diff(moment(start), 'minutes')
        }, 0)

        const totalScheduled = events.filter((a) => {
            return new Date(a.start)?.getTime() < new Date(props.horizon?.end)?.getTime() && new Date(a.end)?.getTime() > new Date(props.horizon?.start)?.getTime() && a.data?.people?.indexOf(person.id) > -1
        }).reduce((prev, curr) => {
            let start = curr.start > props.horizon.start ? curr.start : props.horizon.start;
            let end = curr.end < props.horizon.end ? curr.end : props.horizon.end;

            return prev + moment(end).diff(moment(start), 'minutes')
        }, 0)

        const totalWindow = moment(props.horizon?.end).diff(moment(props.horizon?.start), 'minutes')

        console.log({totalScheduled, totalWindow, events})
        return {
            leave: totalLeave / totalWindow,
            scheduled: totalScheduled / totalWindow
        }
    }

    return (
        <Box>
            <TextField fullWidth size="small" label="Search" />
            <List sx={{ height: '200px', overflow: 'auto'}}>
                {props.people?.filter(onLeave).map((people) => {
                    const {leave: leaveAvailability, scheduled: scheduleAvailability} = getAvailability(people);
                    return <ListItem   
                        dense
                        
                        disablePadding sx={{ display: 'flex', alignItems: 'center' }}>
                        <ListItemButton 
                            disableGutters
                            onClick={() => {
                            if ((selected || []).indexOf(people.id) < 0) {
                                let newSelection = [
                                    ...selected,
                                    people.id
                                ];
                                setSelected(newSelection);
                                props.onSelect?.(newSelection)
                            } else {
                                let newSelection = (selected || []).filter((a) => a != people.id) as any;
                                setSelected(newSelection);
                                props.onSelect?.(newSelection)
                            }
                        }}>

                            <Checkbox
                                checked={selected?.indexOf(people.id) > -1}
                                 />
                            <Box sx={{flex: 1}}>
                                <Typography>{people.name}</Typography>
                            </Box>

                            {scheduleAvailability > 0 &&  <CircularProgressWithLabel value={scheduleAvailability * 100} />}
                            {/* <Box sx={{
                                width: scheduleAvailability * 100 + '%',
                                background: 'red',
                                height: '2px'
                            }} /> */}
                        </ListItemButton>
                    </ListItem>
                })}
            </List>
        </Box>
    )
}


function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number },
  ) {

    const value = props.value > 100 ? 100 : props.value
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress 
            // size={25}
            color={props.value > 100 ? 'error' : 'primary'}
            variant="determinate" value={value}/>
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            component="div"
            sx={{ color: 'text.secondary' }}
          >{props.value > 100 ? `${Math.round(props.value)/100}x` :  `${Math.round(props.value)}%`}</Typography>
        </Box>
      </Box>
    );
  }
  