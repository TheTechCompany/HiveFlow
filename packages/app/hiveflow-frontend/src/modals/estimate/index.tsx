import { BaseModal, FormInput } from '@hexhive/ui';
import React, { useEffect, useState } from 'react';

export interface Estimate {
    id?: string;
    name?: string;
}
export interface EstimateModalProps {
    open: boolean;
    selected?: Estimate;
    onSubmit?: (estimate: Estimate) => void;
    onDelete?: () => void;
    onClose?: () => void;
}

export const EstimateModal : React.FC<EstimateModalProps> = (props) => {

    const [ estimate, setEstimate ] = useState<Estimate>({})

    const submit = () => {
        props.onSubmit?.(estimate)
    }

    useEffect(() => {
        setEstimate({...estimate})
    }, [props.selected])

    return (
        <BaseModal 
            title='Create Estimate'
            onClose={props.onClose}
            onSubmit={submit}
            onDelete={props.selected && props.onDelete}
            open={props.open}>
            <FormInput 
                value={estimate.name}
                onChange={(e) => setEstimate({...estimate, name: e})}
                placeholder='Estimate name' />
        </BaseModal>
    )
}