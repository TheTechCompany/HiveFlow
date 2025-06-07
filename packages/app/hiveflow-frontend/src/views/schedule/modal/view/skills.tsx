import { Box, Checkbox, List, ListItem, ListItemButton, TextField, Typography } from "@mui/material"

export const SkillView = (props: any) => {

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
        <Box>
            <List sx={{height: '200px'}}>
                {skills?.map((skill) => (
                    <ListItem disablePadding sx={{ padding: '8px', display: 'flex', alignItems: 'center' }}>
        
                            <Typography>{skill.skill} - {skill.hours}hrs</Typography>
                            {/* <Typography>{skill.hours}</Typography> */}
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}