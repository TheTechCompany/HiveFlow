import { Box, Button } from 'grommet'
import React from 'react'

export const TabHeader = (props) => {
    const menu = [
        'People',
        'Equipment',
        'Notes'
    ]
    return (
        <Box
            pad={{ horizontal: 'xsmall', bottom: 'xsmall' }}
            flex
        >
            <Box
                gap="xsmall"
                background={'accent-1'}
                direction='row'>
                {menu.map((item) => (
                    <Button
                        plain
                        active={props.activeTab === item.toLowerCase()}
                        style={{ padding: 6, borderRadius: 3, color: '#2b2b2b' }}
                        hoverIndicator
                        label={item}
                        onClick={() => props.setActiveTab(item.toLowerCase())} />
                ))}

            </Box>

        </Box>
    )
}