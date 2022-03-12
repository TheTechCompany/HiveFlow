import { BaseModal, FormInput } from '@hexhive/ui';
import React, { useEffect, useState } from 'react';

export interface Equipment {
    id?: string;
    name?: string;

}

export interface EquipmentModalProps {
    open: boolean;
    selected?: Equipment;

    onClose?: () => void;
    onSubmit?: (equipment: Equipment) => void;
    onDelete?: () => void;
}

export const EquipmentModal : React.FC<EquipmentModalProps> = (props) => {
    const [ equipment, setEquipment ] = useState<Equipment>({});

    const submit = () => {
        props.onSubmit?.(equipment)
    }

    useEffect(() => {
        setEquipment({...props.selected})
    }, [props.selected])

    return (
        <BaseModal 
            title='Create Equipment'
            onClose={props.onClose}
            onSubmit={submit}
            onDelete={props.selected && props.onDelete}
            open={props.open}>
            <FormInput 
                value={equipment.name}
                onChange={(e) => setEquipment({...equipment, name: e})}
                placeholder='Equipment Name' />
        </BaseModal>
    )
}