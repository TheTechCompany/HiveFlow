import { Box, Button, Paper, Tab, Tabs } from '@mui/material'
import React from 'react'

export const TabHeader = (props) => {
    const menu = [
        'People',
        'Equipment',
        'Notes'
    ]
    return (
        <Paper sx={{bgcolor: 'secondary.main', borderRadius: 0, marginTop: '4px'}}>
            <Tabs
                onChange={(ev, value) => props.setActiveTab(value)}
                value={props.activeTab}
                >
                {menu.map((item) => (
                    <Tab
                        value={item.toLowerCase()}
                        label={item}
                         />
                ))}

            </Tabs>
        </Paper>
    )
}