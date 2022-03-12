import { BaseModal, FormInput } from '@hexhive/ui';
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
            <FormInput value={project.name} onChange={(e) => setProject({...project, name: e})} placeholder='Project Name' />
            <FormInput value={project.status} onChange={(e) => setProject({...project, status: e})} placeholder="Status" />
        </BaseModal>
    )
}