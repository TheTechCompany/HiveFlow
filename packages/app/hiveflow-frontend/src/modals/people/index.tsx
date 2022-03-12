import { BaseModal, FormInput } from '@hexhive/ui';
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

export const PeopleModal : React.FC<PeopleModalProps> = (props) => {
    const [ person, setPerson ] = useState<Person>({})

    const submit = () => {
        props.onSubmit?.(person)
    }

    useEffect(() => {
        setPerson({...props.selected})
    }, [props.selected])

    return (
        <BaseModal 
            title='Create Person'
            onClose={props.onClose}
            onDelete={props.selected && props.onDelete}
            onSubmit={submit}
            open={props.open}>
            <FormInput 
                value={person.name} 
                onChange={(e) => setPerson({...person, name: e})} 
                placeholder='Name' />
        </BaseModal>
    )
}