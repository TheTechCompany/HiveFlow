import React, { useEffect, useState } from 'react'

import { BaseModal } from '@hexhive/ui'
import { Box, Button, Select, Tab, Tabs } from 'grommet';
import {PeopleTab} from './tabs/people-tab';
import {EquipmentTab} from './tabs/equipment-tab';
import NoteTab from './tabs/note-tab';
import moment from 'moment';

export interface ScheduleItem {
    id?: string;
    project?: string;
    people?: string[];
    equipment?: string[];
    notes?: string[];
}

export interface ScheduleModalProps {
    open: boolean;
    onClose?: () => void;
    onSubmit?: (item: ScheduleItem) => void;
    onDelete?: () => void;

    selected?: any;

    date?: Date;

    projects?: any[]
    people?: any[];
    equipment?: any[];

}

export const ScheduleModal : React.FC<ScheduleModalProps> = (props) => {

    const [ item, setItem ] = useState<ScheduleItem>({})

    useEffect(() => {
        setItem({
            ...props.selected,
            project: props.selected?.project?.id
        });
    }, [props.selected]);

    const menu = [
        'People',
        'Equipment',
        'Notes'
    ]

    const [ projectSearchString, setProjectSearchString ] = useState('')

    const [ activeTab, setActiveTab ] = useState('')

    console.log({item})
    const renderActiveTab = () => {
        switch(activeTab){
            case 'people':
                return (
                    <PeopleTab 
                        labelKey='name'
                        selected={item.people}
                        onChange={(people) => {
                            console.log({people})
                            setItem({...item, people: people})
                        }}
                        options={props.people?.filter((a) => item.people?.map((x: any) => x.id).indexOf(a.id) < 0)}
                        />
                );
            case 'equipment':
                return (
                    <EquipmentTab
                        labelKey='name'
                        options={props.equipment || []}    
                    />
                );
            case 'notes':
                return (
                    <NoteTab />
                )
        }
    }

    const onSubmit = () => {
        props.onSubmit?.(item)
    }

    const filterProjects = (item: any) => {
        if(!projectSearchString) return true;
        if(projectSearchString.length == 0) return true;
        if(item?.name?.indexOf(projectSearchString) > -1 || item?.displayId?.indexOf(projectSearchString) > -1) return true;
        return false;
    }

    console.log({peopel: item.people})
    return (
        <BaseModal
            width='large'
            title={`Schedule - ${moment(props.date).format('DD/MM/yy')}`}
            open={props.open}
            onDelete={props.selected && props.onDelete}
            onSubmit={onSubmit}
            onClose={props.onClose}
            >

            <Select 
                value={item.project}
                onChange={({value}) => setItem({...item, project: value})}
                onSearch={(searchString) => setProjectSearchString(searchString)}
                valueKey={{key: 'id', reduce: true}}
                labelKey={(project) => `${project.displayId} - ${project.name}`}
                options={props.projects?.filter(filterProjects) }
                />
            
            <Box    
                flex
                >
                <Box
                    gap="xsmall"
                    background={'neutral-1'}
                    direction='row'>
                    {menu.map((item) => (
                        <Button
                        plain
                        active={activeTab === item.toLowerCase()}
                        style={{padding: 6, borderRadius: 3}}
                        hoverIndicator
                        label={item}
                        onClick={() => setActiveTab(item.toLowerCase())} />
                    ))}
                
                </Box>
                

                <Box
                    height={{min: '200px'}}
                    flex>
                    {renderActiveTab()}
                </Box>
            </Box>
            
        </BaseModal>
    )
}