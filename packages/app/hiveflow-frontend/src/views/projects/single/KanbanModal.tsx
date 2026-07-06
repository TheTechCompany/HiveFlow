import { Box, Typography, Checkbox, Dialog, TextField, Button } from '@mui/material';
import React from 'react';
import { useState } from 'react';

export interface KanbanModalProps {
    open: boolean;
    onClose?: any;

    column?: string;
}

export const KanbanModal : React.FC<KanbanModalProps> = (props) => {

    const [ cleanupEnabled, setCleanupEnabled ] = useState<boolean>(false);

    const [ cleanupOptions, setCleanupOptions ] = useState<{
        ttl?: number;
    }>({})

    return (
        <Dialog 
            open={props.open}
            onClose={props.onClose}>
        <Box sx={{ width: '384px', display: 'flex', flexDirection: 'column', gap: 1, borderRadius: '6px', overflow: 'hidden' }}>
            <Box sx={{ padding: '6px', bgcolor: 'secondary.main', display: 'flex', flexDirection: 'row' }}>
                <Typography>Column settings</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, padding: '6px' }}>
                <TextField value={props.column} placeholder="Column Name" size="small" variant="outlined" />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox checked={cleanupEnabled} onChange={(e) => setCleanupEnabled(e.target.checked)} />
                    <Typography>Enable auto-cleanup</Typography>
                </Box>
                {cleanupEnabled ? (
                    <Box>
                        <TextField value={cleanupOptions.ttl} onChange={(e) => setCleanupOptions({...cleanupOptions, ttl: parseFloat(e.target.value)})} type="number" placeholder="Keep for (days)" size="small" variant="outlined" />
                    </Box>
                ) : null}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', padding: '6px', flexDirection: 'row' }}>
                <Button onClick={props.onClose}>Close</Button>
                <Button variant="contained" color="primary">Save</Button>
            </Box>
            </Box>
        </Dialog>
    );
}