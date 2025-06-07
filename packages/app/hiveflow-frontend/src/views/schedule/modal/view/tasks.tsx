import { Box, Checkbox, List, ListItem, ListItemButton, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"

export const TasksView = (props: any) => {

    const [ assignedTasks, setAssignedTasks ] = useState<any[]>([]);

    useEffect(() => {
        setAssignedTasks(props.selected)
    }, [props.selected])
    return (
        <Box>
            <TextField fullWidth size="small" label="Search" />
            <List sx={{height: '200px'}}>
                {props.tasks?.map((task) => (
                    <ListItem disablePadding sx={{ display: 'flex', alignItems: 'center' }}>
                        <ListItemButton disableGutters onClick={() => {
                            console.log("SELECT TASK", {task})
                              if ((assignedTasks || []).indexOf(task.id) < 0) {
                                let newSelection = [
                                    ...assignedTasks,
                                    task.id
                                ];
                                setAssignedTasks(newSelection);
                                props.onSelect?.(newSelection)
                            } else {
                                let newSelection = (assignedTasks || []).filter((a) => a != task.id) as any;
                                setAssignedTasks(newSelection);
                                props.onSelect?.(newSelection)
                            }
                        }}>

                            <Checkbox
                                checked={assignedTasks?.indexOf(task.id) > -1}
                                 />
                            <Typography>{task.title}</Typography>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}