import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';

export interface BatchFormData {
    id?: string;
    title?: string;
    description?: string;
    projectId?: string;
    reviewer?: string;
    status?: string;
}

export interface BatchModalProps {
    open: boolean;
    selected?: BatchFormData;
    onClose?: () => void;
    onSubmit?: (batch: BatchFormData) => void;
    onDelete?: () => void;
}

export const BatchModal: React.FC<BatchModalProps> = (props) => {
    const [batch, setBatch] = useState<BatchFormData>({});

    useEffect(() => {
        setBatch({ ...props.selected });
    }, [props.selected]);

    const submit = () => {
        props.onSubmit?.(batch);
    };

    const isEdit = !!props.selected?.id;

    return (
        <Dialog fullWidth open={props.open} onClose={props.onClose}>
            <DialogTitle>
                {isEdit ? 'Edit Batch' : 'Batch'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <TextField
                        size="small"
                        fullWidth
                        value={batch.title || ''}
                        onChange={(e) => setBatch({ ...batch, title: e.target.value })}
                        label="Title"
                        required
                    />

                    <TextField
                        size="small"
                        fullWidth
                        value={batch.reviewer || ''}
                        onChange={(e) => setBatch({ ...batch, reviewer: e.target.value })}
                        label="Reviewer (optional)"
                    />

                    <TextField
                        size="small"
                        fullWidth
                        multiline
                        minRows={3}
                        value={batch.description || ''}
                        onChange={(e) => setBatch({ ...batch, description: e.target.value })}
                        label="Description"
                    />
                </Box>
            </DialogContent>
            <DialogActions
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isEdit ? 'space-between' : 'flex-end',
                }}>
                {isEdit ? (
                    <Button color="error" onClick={props.onDelete}>
                        Delete
                    </Button>
                ) : null}
                <Box sx={{ display: 'flex', gap: '8px' }}>
                    <Button onClick={props.onClose}>Close</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={submit}
                        disabled={!batch.title}>
                        Save
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};
