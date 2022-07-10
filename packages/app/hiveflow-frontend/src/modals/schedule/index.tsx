import React, { useEffect, useState } from 'react'

import { AvatarList, BaseModal } from '@hexhive/ui'
import { PeopleTab } from './tabs/people-tab';
import { EquipmentTab } from './tabs/equipment-tab';
import NoteTab from './tabs/note-tab';
import moment from 'moment';

import { Autocomplete, Dialog, Box, Typography, Button, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import { ScheduleModalHeader } from './header';
import { CloneTab } from './tabs/clone-tab';
import { TabHeader } from './tabheader';
import { stringToColor } from '@hexhive/utils';

export interface ScheduleItem {
    id?: string;
    project?: { id: string };
    people?: { id: string }[];
    equipment?: string[];
    notes?: string[];

    owner?: { id: string, name: string }
    managers?: { id: string, name: string }[]
}

export interface ScheduleModalProps {
    open: boolean;
    onClose?: () => void;
    onSubmit?: (item: any) => void;
    onDelete?: () => void;

    onJoin?: () => void;
    onLeave?: () => void;

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

        setCloneDates([]);

    }, [props.selected]);


    const [cloneDates, setCloneDates] = useState<Date[]>([]);

    const [cloneTab, openCloneTab] = useState(false);

    const [projectSearchString, setProjectSearchString] = useState('')

    const [activeTab, setActiveTab] = useState('people')

    const canEdit = () => {
        return !props.selected || props.selected.canEdit
    }

    useEffect(() => {
        if (!props.open) {
            openCloneTab(false);
        }
    }, [props.open]);

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
                        options={props.people?.filter((a) => (item.people || []).map((x: any) => x.id).indexOf(a.id) < 0)}
                    />
                );
            case 'equipment':
                return (
                    <EquipmentTab
                        labelKey='name'
                        selected={item.equipment}
                        onChange={(equipment) => {
                            setItem({ ...item, equipment: equipment })
                        }}
                        options={props.equipment?.filter((a) => (item.equipment || []).map((x: any) => x.id).indexOf(a.id) < 0) || []}
                    />
                );
            case 'notes':
                return (
                    <NoteTab
                        data={item.notes || []}
                        onChange={(notes) => {
                            setItem({ ...item, notes: notes })
                        }}
                    />
                )
        }
    }

    const onSubmit = () => {
        if (cloneTab) {
            props.onSubmit({
                cloneDates
            })
        } else {
            console.log(item)
            props.onSubmit?.({
                ...item,
                project: item?.project?.id
            })
        }
    }

    const filterProjects = (item: any) => {
        if (!projectSearchString) return true;
        if (projectSearchString.length == 0) return true;
        if (item?.name?.indexOf(projectSearchString) > -1 || item?.displayId?.indexOf(projectSearchString) > -1) return true;
        return false;
    }

    const owners = (item.managers || []).concat(item.owner ? [item.owner] : []).map((x) => ({
        color: stringToColor(x.id),
        name: x.name
    }))

    return (
        <Dialog
            maxWidth='lg'
            fullWidth
            title={`Schedule - ${moment(props.date).format('DD/MM/yy')}`}
            open={props.open}

            onClose={props.onClose}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>Create schedule for {moment(props.date).format('DD/MM/yy')}</Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>

                    {props.selected &&
                        <><AvatarList size={25} users={owners} />
                            <Button
                                onClick={() => {
                                    if (canEdit()) {
                                        props.onLeave()
                                    } else {
                                        props.onJoin()
                                    }

                                    // props.onLeave()
                                }}

                                style={{ padding: 6, borderRadius: 3 }}>{canEdit() ? "Leave" : "Join"}</Button></>}
                </Box>
            </DialogTitle>
            <DialogContent sx={{padding: 0, flex: 1, minHeight: '50vh', display: 'flex', flexDirection: 'column'}}>
                {/* onDelete={props.selected && props.onDelete}
            onSubmit={onSubmit} */}

                <ScheduleModalHeader
                    item={item}
                    onChange={(item) => setItem(item)}
                    projects={props.projects}

                />

                {!cloneTab && <TabHeader
                    setActiveTab={setActiveTab}
                    activeTab={activeTab}
                />}
                <Box sx={{flex: 1, display: 'flex'}}>

                    {cloneTab ? (
                        <CloneTab
                            project={props.selected?.project}
                            selected={cloneDates}
                            onSelect={(dates) => {
                                setCloneDates(dates);
                            }} />
                    ) : <Box sx={{maxHeight: '40vh', display: 'flex', flex: 1}}>{renderActiveTab()}</Box>}

                </Box>


            </DialogContent>
            <DialogActions>
                {props.selected && canEdit() && <Button variant="outlined" onClick={() => openCloneTab(!cloneTab)}>{cloneTab ? "Edit" : "Clone"}</Button>}

                {props.selected && canEdit() && !cloneTab && <Button
                    disabled={!canEdit()}
                    onClick={props.onDelete} style={{ color: 'red' }}>Delete</Button>}
                <Button onClick={props.onClose}>Close</Button>
                <Button
                    disabled={!canEdit()}
                    onClick={onSubmit} variant="contained" >{cloneTab ? "Clone" : "Save"}</Button>
            </DialogActions>

        </Dialog>
    )
}