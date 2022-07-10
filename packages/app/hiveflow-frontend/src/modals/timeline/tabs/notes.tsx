import React from 'react'
import { Box, TextField } from '@mui/material'
export const NoteTab = ({notes, updateNotes}: any) => {
    return (
        <Box sx={{flex: 1, display: 'flex', padding: '6px'}}>
            <TextField
                fullWidth
                value={notes}
                onChange={updateNotes}
                multiline
                minRows={8}
                label="Notes" />
        </Box>
    );
}