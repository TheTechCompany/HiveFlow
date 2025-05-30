import { Box, Checkbox, List, ListItem, ListItemButton, TextField, Typography } from "@mui/material"

export const PeopleView = (props: any) => {
    return (
        <Box>
            <TextField fullWidth size="small" label="Search" />
            <List>
                {props.people?.map((people) => (
                    <ListItem disablePadding sx={{ display: 'flex', alignItems: 'center' }}>
                        <ListItemButton onClick={() => {
                            // if ((schedule.people || []).indexOf(people.id) < 0) {
                            //     setSchedule((schedule) => ({
                            //         ...schedule,
                            //         people: [...(schedule.people || []), people.id]
                            //     }))
                            // } else {
                            //     setSchedule((schedule) => ({
                            //         ...schedule,
                            //         people: (schedule.people || []).filter((a) => a != people.id)
                            //     }))
                            // }
                        }}>

                            <Checkbox
                                // checked={schedule.people?.indexOf(people.id) > -1}
                                 />
                            <Typography>{people.name}</Typography>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}