import { BaseModal, FormInput } from '@hexhive/ui';
import React, { useState } from 'react';

export const FolderModal = (props) => {

    const [ folder, setFolder ] = useState<{name?: string}>()

    const onSubmit = () => {
        props.onSubmit?.(folder)
    }

    return (
        <BaseModal
            title='Create Folder'
            open={props.open}
            onClose={props.onClose}
            onSubmit={onSubmit}
            >

            <FormInput 
                value={folder?.name}
                onChange={(value) => setFolder({...folder, name: value})}
                placeholder='Folder name' />
        </BaseModal>
    )
}