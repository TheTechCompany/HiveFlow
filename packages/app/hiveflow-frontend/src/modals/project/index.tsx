import { BaseModal, FormControl, FormInput } from '@hexhive/ui';
import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

export interface Project { 
    id?: string;
    name?: string;
    status?: string;
}

export interface ProjectModalProps {
    open: boolean;
    selected?: Project;

    onClose?: () => void;
    onSubmit?: (project: Project) => void;
    onDelete?: () => void;
}

export const ProjectModal : React.FC<ProjectModalProps> = (props) => {
    const [ project, setProject ] = useState<Project>({})
    
    const submit = () => {
        props.onSubmit(project)
    }

    useEffect(() => {
        setProject({...props.selected})
    }, [props.selected])

    return (
        <BaseModal 
            title={`${props.selected ? 'Update' : 'Create'} Project`}
            onClose={props.onClose}
            onSubmit={submit}
            onDelete={props.selected && props.onDelete}
            open={props.open}>
            <TextField
                size="small"
                fullWidth
                value={project.name} 
                onChange={(e) => setProject({...project, name: e.target.value})} 
                placeholder='Project Name' />
            
            <FormControl
                fullWidth
                placeholder='Status'
                labelKey='id'
                valueKey='id'
                value={project.status}
                onChange={(e) => setProject({...project, status: e})} 
                options={[{id: 'Open'}, {id: 'Review'}, {id: 'Done'}]}
                />            
        </BaseModal>
    )
}