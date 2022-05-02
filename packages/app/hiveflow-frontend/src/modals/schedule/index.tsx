import React, { useState } from 'react'

import { BaseModal } from '@hexhive/ui'
import { Box, Button, Select, Tab, Tabs } from 'grommet';
import {PeopleTab} from './tabs/people-tab';
import {EquipmentTab} from './tabs/equipment-tab';
import NoteTab from './tabs/note-tab';

export interface ScheduleModalProps {
    open: boolean;
    onClose?: () => void;

    projects?: any[]
    people?: any[];
    equipment?: any[];

}

export const ScheduleModal : React.FC<ScheduleModalProps> = (props) => {

    const menu = [
        'People',
        'Equipment',
        'Notes'
    ]

    const [ projectSearchString, setProjectSearchString ] = useState('')

    const [ activeTab, setActiveTab ] = useState('')

    const renderActiveTab = () => {
        switch(activeTab){
            case 'people':
                return (
                    <PeopleTab 
                        labelKey='name'
                        options={props.people}
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

    return (
        <BaseModal
            width='large'
            title='Schedule'
            open={props.open}
            onClose={props.onClose}
            >

            <Select 
                onSearch={(searchString) => setProjectSearchString(searchString)}
                valueKey={{key: 'id', reduce: true}}
                labelKey={(project) => `${project.displayId} - ${project.name}`}
                options={props.projects?.filter((a) => !projectSearchString || projectSearchString.length == 0 || a?.name.indexOf(projectSearchString) > -1 || a?.displayId.indexOf(projectSearchString)) }
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