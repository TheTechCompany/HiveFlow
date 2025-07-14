import { Dialog, Button, DialogActions, DialogTitle, TextField, DialogContent } from '@mui/material';
import React, { useEffect, useState } from 'react';

export interface Equipment {
    id: string;
    name: string;
}

export interface EquipmentModalProps {
    open: boolean;

    selected?: any;
    
    onClose?: () => void;
    onDelete?: () => void;
    onSubmit?: (equipment: any) => void;
}

export const EquipmentModal: React.FC<EquipmentModalProps> = (props) => {
    const [equipment, setEquipment] = useState<any>({})

    const submit = () => {
        props.onSubmit?.(equipment)
    }

    useEffect(() => {
        setEquipment({ ...props.selected })
    }, [props.selected])

    return (
        <Dialog
            fullWidth
            onClose={props.onClose}
            // onDelete={props.selected && props.onDelete}
            open={props.open}>
            <DialogTitle>{props.selected ? 'Update' : 'Create'} Equipment</DialogTitle>
            <DialogContent>
                <TextField
                    sx={{ marginTop: '6px' }}
                    size="small"
                    fullWidth
                    value={equipment.name}
                    onChange={(e) => setEquipment({ ...equipment, name: e.target.value })}
                    label='Name' />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button onClick={submit} variant="contained" color="primary">
                    {props.selected ? "Save" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}