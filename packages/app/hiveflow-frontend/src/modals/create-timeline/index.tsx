import React, { useState } from 'react'

import {  FormInput } from '@hexhive/ui'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

export const CreateTimelineModal = (props) => {

    const [ timeline, setTimeline ] = useState<{id?: string, name?: string}>({})

    const onSubmit = () => {
        // console.log({timeline})
        props.onSubmit?.(timeline)
    }

    return (
        <Dialog
            fullWidth
            onClose={props.onClose}
            // onDelete={props.selected && props.onDelete}
            open={props.open}>
            
            <DialogTitle>Create Timeline</DialogTitle>
            <DialogContent>
              <FormInput  
                placeholder='Timeline Name'
                value={timeline.name}
                onChange={(value) => setTimeline({...timeline, name: value})}
                />
            </DialogContent>
            <DialogActions>
                <Button>Cancel</Button>
                <Button variant='contained' color="primary" onClick={onSubmit}>Save</Button>
            </DialogActions>

        </Dialog>
    )
}