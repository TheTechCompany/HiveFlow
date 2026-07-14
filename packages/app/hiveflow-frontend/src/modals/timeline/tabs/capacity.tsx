import React from 'react';
import { Add } from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { CapacityItem } from '../CapacityItem';

export const CapacityTab = ({
    addCapacityItem,
    plan,
    removeCapacityItem,
    updateCapacityItem,
    type
}: any) => {
    return (
        <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', padding: '6px'}}>
            <Box
                sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                >
                <Typography>Capacity</Typography>
                <IconButton
                    onClick={addCapacityItem}
                >
                    <Add fontSize="small" />
                    </IconButton>
            </Box>
            <Box
                sx={{flex: 1, overflow: 'auto'}}>
                {plan.data?.map((x: any, ix: number) => (
                    <CapacityItem
                        item={x}
                        type={type}
                        removeCapacityItem={() => removeCapacityItem(ix)}
                        updateCapacityItem={(key, value) => updateCapacityItem(ix, key, value)} />
                ))}
            </Box>

        </Box>
    );
}
