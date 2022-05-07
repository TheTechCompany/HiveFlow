import React, { useEffect, useState } from 'react'

import { BaseModal } from '@hexhive/ui'
import { Box, Button as GButton, Text, Select, Tab, Tabs } from 'grommet';
import { PeopleTab } from './tabs/people-tab';
import { EquipmentTab } from './tabs/equipment-tab';
import NoteTab from './tabs/note-tab';
import moment from 'moment';

import { Autocomplete, Dialog, Button, DialogContent, TextField } from '@mui/material';
import { ScheduleModalHeader } from './header';

export interface ScheduleItem {
    id?: string;
    project?: {id: string};
    people?: {id: string}[];
    equipment?: string[];
    notes?: string[];
}

export interface ScheduleModalProps {
    open: boolean;
    onClose?: () => void;
    onSubmit?: (item: any) => void;
    onDelete?: () => void;

    selected?: any;

    date?: Date;

    projects?: any[]
    people?: any[];
    equipment?: any[];

}

export const ScheduleModal: React.FC<ScheduleModalProps> = (props) => {

    const [item, setItem] = useState<ScheduleItem>({})

    useEffect(() => {
        setItem({
            ...props.selected,
            // project: props.selected?.project?.id
        });
    }, [props.selected]);

 

    const [projectSearchString, setProjectSearchString] = useState('')

    const [activeTab, setActiveTab] = useState('people')

    console.log({ item })
    const renderActiveTab = () => {
        switch (activeTab) {
            case 'people':
                return (
                    <PeopleTab
                        labelKey='name'
                        selected={item.people}
                        onChange={(people) => {
                            console.log({ people })
                            setItem({ ...item, people: people })
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
        props.onSubmit?.({
            ...item,
            project: item?.project?.id
        })
    }

    const filterProjects = (item: any) => {
        if (!projectSearchString) return true;
        if (projectSearchString.length == 0) return true;
        if (item?.name?.indexOf(projectSearchString) > -1 || item?.displayId?.indexOf(projectSearchString) > -1) return true;
        return false;
    }

    console.log({ peopel: item.people })
    return (
        <Dialog
            maxWidth='md'
            title={`Schedule - ${moment(props.date).format('DD/MM/yy')}`}
            open={props.open}

            onClose={props.onClose}
        >
            <Box 
                direction='column'
                flex
                style={{minHeight: '60vh'}}>
            {/* onDelete={props.selected && props.onDelete}
            onSubmit={onSubmit} */}
            <Box pad="small" direction='row' background={'accent-2'}>
                <Text>Create schedule for {moment(props.date).format('DD/MM/yy')}</Text>
            </Box>

            <ScheduleModalHeader
                item={item}
                onChange={(item) => setItem(item)}
                projects={props.projects}
                setActiveTab={setActiveTab}
                activeTab={activeTab}
                />
            <Box flex background={'neutral-2'}>
                <Box
                    height={{ min: '200px' }}
                    flex>
                    {renderActiveTab()}
                    
                </Box>
                <Box pad="xsmall" direction='row' justify='end'>
                        <Button onClick={props.onClose}>Cancel</Button>
                        <Button onClick={onSubmit} variant="contained" >Save</Button>
                </Box>
            </Box>
          
            </Box>

        </Dialog>
    )
}