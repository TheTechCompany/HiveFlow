import { Box, Checkbox, List, ListItem, ListItemButton, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"

export const PeopleView = (props: any) => {

    const [ selected, setSelected ] = useState<any>([]);

    useEffect(() => {
        setSelected(props.selected)
    }, [props.selected])

    return (
        <Box>
            <TextField fullWidth size="small" label="Search" />
            <List>
                {props.people?.map((people) => (
                    <ListItem   
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
                            <Typography>{people.name}</Typography>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}