import { gql, useApolloClient, useQuery } from "@apollo/client";
import { AvatarList, Kanban } from "@hexhive/ui";
import { Autocomplete, Box, Divider, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Subject } from '@mui/icons-material'
import { TaskModal } from "../../modals/new-task";
import { useMutation } from "@hive-flow/api";

export const Assignments = () => {

    const [ filter, setFilter ] = useState<any[]>([]);

    const [ taskModalOpen, openTaskModal ] = useState(false);

    const [ selectedTask, setSelectedTask ] = useState<any>(null);

    const STATUS = ["Backlog", "In Progress", "Reviewing", "Finished"];

    const client = useApolloClient();

    const {data} = useQuery(gql`
        query GetAssignedTasks {

            users (active: true) {
                id
                name
            }

              
            assignments{

                ... on EstimateTask{

                    id

                    title
                    description
                    startDate
                    endDate
                    status

                    timelineRank
                    columnRank

                    members {
                        id
                        name
                    }

                    estimate {
                        displayId
                        id
                        name
                    }
                }

                ... on ProjectTask {
                    id
                    title
                    description
                    startDate
                    endDate
                    status

                    timelineRank
                    columnRank

                    members {
                        id
                        name
                    }

                    project {
                        id
                        displayId
                        name
                    }
                }
            }
        }
    `)

    const assignedTasks = data?.assignments || [];

    const taskFilters = assignedTasks?.map((x) => x.project || x.estimate);

    const users = data?.users || [];


    const [ updateProjectTask ] = useMutation((mutation, args: any) => {
        const item = mutation.updateProjectTask({
            id: args?.id,
            input: {
                ...args?.input
            }
        })
        return {
            item: {
                ...item
            }
        }
    })


    const [ updateEstimateTask ] = useMutation((mutation, args: any) => {
        const item = mutation.updateEstimateTask({
            id: args?.id,
            input: {
                ...args?.input
            }
        })

        return {
            item: {
                ...item
            }
        }
    })

    const updateTask = async (id: string, taskUpdate: any, type?: string) => {
        if(selectedTask?.project || type == 'project'){
            await updateProjectTask({
                args: {
                    id,
                    input: taskUpdate
                }
            });
        }else if(selectedTask?.estimate || type == 'estimate'){
            await updateEstimateTask({
                args:{ 
                    id,
                    input: taskUpdate
                }
            });
        }
    }

    const [ deleteProjectTask ] = useMutation((mutation) => {
        const item = mutation.deleteProjectTask({
            id: selectedTask?.id
        })
        return {
            item: {
                ...item
            }
        }
    })


    const [ deleteEstimateTask ] = useMutation((mutation) => {
        const item = mutation.deleteEstimateTask({
            id: selectedTask?.id
        })

        return {
            item: {
                ...item
            }
        }
    })

    const deleteTask = async () => {
        if(selectedTask?.project){
            await deleteProjectTask()
        }else if(selectedTask?.estimate){
            await deleteEstimateTask()
        }
    }

    const refetch = () => client.refetchQueries({include: ['GetAssignedTasks']});

    return (
        <Paper sx={{flex: 1, bgcolor: 'secondary.main', flexDirection: 'column', display: 'flex'}}>
            <TaskModal 
                users={users}
                onClose={() => {
                    openTaskModal(false)
                    setSelectedTask(null)
                }}
                onDelete={async () => {
                    if(!selectedTask) return;

                    await deleteTask()
                    refetch();

                    setSelectedTask(null)
                    openTaskModal(false)
                    
                }}
                selected={selectedTask}
                onSubmit={async (task) => {
                    console.log(task)
                    if(task.id){
                        //Update
                        await updateTask(selectedTask?.id, {
                            title: task.title,
                            members: task.members,
                            description: task.description, 
                            startDate: task.startDate,
                            endDate: task.endDate,
                            status: task.status
                        })
                    }
                    refetch();

                    setSelectedTask(null)
                    openTaskModal(false)
                }}
                open={taskModalOpen} />

            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Typography sx={{ color: 'navigation.main', padding: '6px' }} fontWeight={'bold'}>Assigned tasks</Typography>

                <Autocomplete 
                    multiple
                    sx={{
                        minWidth: '200px',
                        padding: '6px'
                    }}
                    onChange={(event, values) => {
                        console.log(values)
                        setFilter(values)
                    }}
                    value={filter}
                    getOptionLabel={(option: any) => `${option.displayId} - ${option.name}`}
                    options={taskFilters}
                    renderInput={(params) => <TextField {...params} size='small' label="Filter" />}
                    />
            </Box>
            <Box sx={{bgcolor: '#bfbfbf', display: 'flex', flex: 1}}>
                <Kanban 
                    onDrag={async (result) => {
        
                        // result.
                        const status = STATUS[parseInt(result.destination?.droppableId)]
        
                        const ticket = assignedTasks?.find((a) => a.id == result?.draggableId);
                        const projectType = ticket.project ? 'project' : ticket.estimate ? 'estimate' : null;

                        await updateTask(result?.draggableId, {
                            status
                        }, projectType)

                        refetch()
                        // updateTaskStatus(result.draggableId, result.destination?.index, status)
        
                        // let newTasks = kanbanTasks.slice()
        
                        // let ix = newTasks.map((x) => x.id).indexOf(result.draggableId)
        
                        // newTasks[ix] ={
                        //     ...newTasks[ix],
                        //     status: status
                        // };
                        // setTasks(newTasks)
        
                    }}
                    onSelectCard={(card) => {
                        setSelectedTask({
                            ...card,
                            start: new Date(card.startDate),
                            end: new Date(card.endDate)
                        })
                        openTaskModal(true)
                    
                    }}
                    columns={STATUS.map((x) => {
                        console.log({assignedTasks, filter})
                        let rows = assignedTasks?.filter((a) => {
                            if(!filter || filter.length == 0) return true;
                            if(filter.find((filterObj) => {
                                if(a.project){
                                    return filterObj.__typename == "Project" && filterObj.id == a.project?.id;
                                }else if(a.estimate){
                                    return filterObj.__typename == "Estimate" && filterObj.id == a.estimate?.id;
                                }
                            })) return true;
                        })?.filter((a) => a.status == x)?.map((x) => ({...x, id: x.id, name: x.title}))?.sort((a, b) => a.columnRank?.localeCompare(b.columnRank)) //files.filter((a: any) => a.status == x).map((x) => ({ ...x }))
        
                        // if(x == 'Backlog') {
                        //     rows = rows.filter((a) => a.dependencyOn?.length < 1 || a.dependencyOn?.map((x) => x.status == "Reviewing" || x.status == "Finished")?.indexOf(true) > -1)
                        // }
        
                        return {
                            id: x,
                            title: x,
                            // ttl: x == "Finished" ? finishTtl : undefined,
                            menu: [
                                { label: "Archive all cards", onClick: () => { } },
                                {
                                label: "Column Settings", onClick: () => {
                                    // showKanbanMenu(true)
                                    // setSelectedColumn(x)
                                }
                                }
                            ],
                            rows
                        }
                    })}
                    
                    renderCard={(item) => {
                        return (
                            <Paper sx={{ /* background: stringToColor(item.title), */ background: '#aaa', minHeight: '24px', color: 'black', flexDirection: 'column', display: 'flex'}}>
                                <Box sx={{bgcolor: 'secondary.main', padding: '6px'}}>{item.project?.displayId || item.estimate?.displayId} - {item.project?.name || item.estimate?.name}</Box>
                                <Box sx={{padding: '6px', }}>
                                    <Typography>
                                        {item.name || item.title}
                                    </Typography>
                                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <Box>
                                            {item.description?.length > 0 && <Subject fontSize="small" />}
                                        </Box>
                                        <AvatarList
                                            size={20}
                                            users={item.members}
                                            />
                                    </Box>
                                </Box>
                            </Paper>
                        )
                    }}
                    />
            </Box>
        </Paper>
    )
}