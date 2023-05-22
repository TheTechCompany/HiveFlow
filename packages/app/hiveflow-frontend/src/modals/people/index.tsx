import { BaseModal, FormInput } from '@hexhive/ui';
import { Dialog, Button, DialogActions, DialogTitle, TextField, DialogContent } from '@mui/material';
import React, { useEffect, useState } from 'react';

export interface Person {
    id?: string;
    name?: string;
}

export interface PeopleModalProps {
    open: boolean;
    selected?: Person;
    onClose?: () => void;
    onDelete?: () => void;
    onSubmit?: (person: Person) => void;
}

export const PeopleModal: React.FC<PeopleModalProps> = (props) => {
    const [person, setPerson] = useState<Person>({})

    const submit = () => {
        props.onSubmit?.(person)
    }

    useEffect(() => {
        setPerson({ ...props.selected })
    }, [props.selected])

    return (
        <Dialog
            title='Create Person'
            onClose={props.onClose}
            // onDelete={props.selected && props.onDelete}
            open={props.open}>
            <DialogTitle>{props.selected ? 'Update' : 'Create'} Person</DialogTitle>
            <DialogContent>
                <TextField
                    sx={{ marginTop: '6px' }}
                    size="small"
                    fullWidth
                    value={person.name}
                    onChange={(e) => setPerson({ ...person, name: e.target.value })}
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