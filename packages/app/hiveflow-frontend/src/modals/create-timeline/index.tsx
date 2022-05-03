import React, { useState } from 'react'

import { BaseModal, FormInput } from '@hexhive/ui'

export const CreateTimelineModal = (props) => {

    const [ timeline, setTimeline ] = useState<{id?: string, name?: string}>({})

    const onSubmit = () => {
        // console.log({timeline})
        props.onSubmit?.(timeline)
    }

    return (
        <BaseModal
            title="Create Timeline"
            open={props.open}
            onClose={props.onClose}
            onSubmit={onSubmit}
            >
            <FormInput  
                placeholder='Timeline Name'
                value={timeline.name}
                onChange={(value) => setTimeline({...timeline, name: value})}
                />

        </BaseModal>
    )
}