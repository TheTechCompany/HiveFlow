import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import {
  GET_ESTIMATE_SINGLE,
  UPDATE_ESTIMATE_TASK,
  CREATE_ESTIMATE_TASK,
  DELETE_ESTIMATE_TASK,
  CREATE_ESTIMATE_TASK_DEPENDENCY,
  DELETE_ESTIMATE_TASK_DEPENDENCY,
  CREATE_ESTIMATE_LINE_ITEM,
  UPDATE_ESTIMATE_LINE_ITEM,
  DELETE_ESTIMATE_LINE_ITEM,
} from '@hive-flow/api';
import { Box, Button, IconButton, Paper, Tab, Tabs, Typography } from '@mui/material';
import { ChevronLeft as Previous, Download } from '@mui/icons-material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import Spreadsheet, { createEmptyMatrix } from "react-spreadsheet";
import { QuoteBuilder } from '@hive-flow/ui';
import { debounce, throttle } from 'lodash';
import { TicketsPane } from './panes';
import { EstimateSingleProvider } from './context';
import { TaskModal } from '../../../modals/new-task';
import { arrayMove } from '@dnd-kit/sortable';

export const EstimateSingle = (props) => {
    
    const [ selectedTask, setSelectedTask ] = useState<any>();
    const [taskModalOpen, openTaskModal] = useState(false);

    const navigate = useNavigate()
    const { id } = useParams()

    const client = useApolloClient();

    const { data } = useQuery(GET_ESTIMATE_SINGLE, {
        variables: {
            displayId: id
        },
        fetchPolicy: 'network-only',
    });

    const users = data?.users || [];

    const estimate = data?.estimates?.[0] || {};

    const [_estimate, setEstimate] = useState<{
        displayId?: string;
        name?: string;
        tasks?: any[];
        date?: Date;
        expiry?: Date;
        lineItems?: any[];
        terms?: string;
    }>({
        lineItems: []
    })

    useEffect(() => {
        setEstimate({
            ...estimate,
        })
    }, [JSON.stringify(estimate)])

    // Keep selectedTask in sync with refetched data so subtasks etc. update
    useEffect(() => {
        if (selectedTask?.id && estimate?.tasks) {
            const refreshed = estimate.tasks.find((t: any) => t.id === selectedTask.id);
            if (refreshed) {
                setSelectedTask((prev: any) => ({
                    ...prev,
                    children: refreshed.children,
                    ...refreshed,
                    startDate: refreshed.startDate,
                    endDate: refreshed.endDate,
                }));
            }
        }
    }, [estimate?.tasks]);

    const lineItems = estimate?.lineItems || [];

    const [createLineItem] = useMutation(CREATE_ESTIMATE_LINE_ITEM);
    const [updateLineItem] = useMutation(UPDATE_ESTIMATE_LINE_ITEM);
    const [deleteLineItem] = useMutation(DELETE_ESTIMATE_LINE_ITEM);
    const [createTask] = useMutation(CREATE_ESTIMATE_TASK);
    const [updateTask] = useMutation(UPDATE_ESTIMATE_TASK);
    const [deleteTask] = useMutation(DELETE_ESTIMATE_TASK);
    const [createTaskDependency] = useMutation(CREATE_ESTIMATE_TASK_DEPENDENCY);
    const [deleteTaskDependency] = useMutation(DELETE_ESTIMATE_TASK_DEPENDENCY);

    const debouncedUpdate = useMemo(() => debounce((args: any) => {
        updateLineItem({ variables: args }).then(() => {
            refetch()
        })
    }, 1000), [])

    const refetch = () => {
        client.refetchQueries({ include: ['EstimateSingle'] })
    }

    const _tabs = [
        {
            title: "Tickets",
            path: "tickets",
            element: <TicketsPane />
        },
    ]

    const { pathname } = useLocation()

    const view = _tabs.find((a) => pathname.indexOf(a.path) > -1)?.path

    return (
        <EstimateSingleProvider value={{
            estimateId: id,
            tasks: _estimate?.tasks || [],
            finishTtl: (60 * 1000) * 60 * 24 * 7, //7 days
            refetch,
            createTask: (task: any) => {
                console.log({ task })

                setSelectedTask({ ...task, id: undefined, status: task.status, startDate: task.start, endDate: task.end })
                openTaskModal(true);
            },
            updateTask: (task: any) => {
                setSelectedTask({ ...task, startDate: task.start, endDate: task.end })
                openTaskModal(true)
            },
            updateTaskStatus: (taskId, index, status) => {
                let statusTasks = _estimate?.tasks?.filter((a) => a.status == status)?.sort((a,b) => a.columnRank?.localeCompare(b.columnRank));
                        
                let ix = statusTasks.map((x) => x.id).indexOf(taskId);

                if (ix >= 0) {
                  // Same-column reorder: move the task within the array
                  statusTasks = arrayMove(statusTasks, ix, index)
                }
                // For cross-column moves (ix === -1), the task isn't in the destination
                // list yet, so compute neighbors directly from the target position.

                let above = statusTasks?.[index - 1]?.id;
                let below = ix >= 0 ? statusTasks?.[index + 1]?.id : statusTasks?.[index]?.id;
        
                  updateTask({
                    variables: {
                      id: taskId,
                      input: {
                        status,
                        above: above != taskId ? above : undefined,
                        below: below != taskId ? below : undefined,
                        estimateId: id
                      }
                    }
                  }).then(() => {
                    refetch()
        
                  })
            },
            deleteTask,
            deleteDependency: (source: string, target: string) => {
              deleteTaskDependency({
                variables: {
                  source,
                  target
                }
              }).then(() => {
                refetch();
              })
            },
            createDependency: (source: string, target: string) => {
              createTaskDependency({
                variables: {
                  source,
                  target
                }
              }).then(() => {
                refetch();
              })
            }
        }}>
            <TaskModal 
                users={users}
                open={taskModalOpen} 
                onClose={() => {
                    openTaskModal(false)
                    setSelectedTask(null)
                  }}
                  onDelete={async () => {
                    if(!selectedTask) return;
          
                    await deleteTask({
                      variables: {
                        id: selectedTask?.id
                      }
                    })
                    refetch();
          
                    setSelectedTask(null)
                    openTaskModal(false)
                    
                  }}
                  onAddSubtask={async (parentId, title) => {
                    await createTask({
                      variables: {
                        input: { title, parentId, status: 'Backlog', estimateId: id }
                      }
                    });
                    refetch();
                  }}
                  onSelectTask={(taskId) => {
                    const task = _estimate?.tasks?.find((t: any) => t.id === taskId);
                    if (task) {
                      setSelectedTask({ ...task, startDate: task.start, endDate: task.end });
                    }
                  }}
                  selected={selectedTask}
                  onSubmit={async (task) => {
                    if(task.id){
                      //Update
                      await updateTask({
                        variables: { 
                          id: task.id, 
                          input: {
                             title: task.title,
                             members: task.members,
                             description: task.description, 
                             startDate: task.startDate,
                             endDate: task.endDate,
                             status: task.status,
                             id: undefined, 
                             estimateId: id 
                          }
                       }
                      })
                    }else{
                      //Create
                      await createTask({
                        variables: {
                           input: {
                            title: task.title,
                            members: task.members,
                            description: task.description, 
                            startDate: task.startDate,
                            endDate: task.endDate,
                            status: task.status,
                            id: undefined, 
                            estimateId: id 
                          } 
                        }
                      })
                    }
                    refetch();
          
                    setSelectedTask(null)
                    openTaskModal(false)
                  }} />
            <Paper
                sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
                <Box
                    sx={{ bgcolor: 'secondary.main', color: 'navigation.main', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            sx={{ color: 'navigation.main' }}
                            onClick={() => navigate('../')}
                        >
                            <Previous fontSize='small' />
                        </IconButton>
                        <Typography>{_estimate.displayId} - {_estimate.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                        <Tabs
                            onChange={(e, value) => navigate(value)}
                            value={view}>
                            {_tabs.map((tab) => (
                                <Tab value={tab.path} label={tab.title} />
                            ))}

                        </Tabs>
                    </Box>
                </Box>
                <Box
                    sx={{ flex: 1, overflow: 'auto', maxHeight: 'calc(100% - 36px)', display: 'flex' }}>
                    <Routes>
                        {/* <Route path="" element={<QuoteBuilder
                            items={_estimate?.lineItems || []}
                            quoteId={_estimate?.displayId}
                            onUpdateRow={(id, key, value) => {
                                let items = _estimate.lineItems?.slice();
                                let ix = items.map((x) => x.id).indexOf(id)
                                items[ix] = {
                                    ...items[ix],
                                    [key]: value
                                }

                                setEstimate({
                                    ..._estimate,
                                    lineItems: items
                                })

                                // cancelDebounce()

                                debouncedUpdate({
                                    id: id,
                                    input: {
                                        [key]: value
                                    }
                                })
                            }}
                            onDeleteRow={(id) => {
                                let items = _estimate.lineItems.slice();
                                let ix = items.map((a) => a.id).indexOf(id)
                                items.splice(ix, 1);
                                setEstimate({
                                    ..._estimate,
                                    lineItems: items
                                });

                                deleteLineItem({
                                    variables: {
                                        id: id
                                    }
                                }).then(() => {
                                    refetch()
                                })
                            }}
                            onAddRow={() => {
                                createLineItem({
                                    variables: {
                                        input: {

                                        }
                                    }
                                }).then(() => {
                                    refetch()
                                })


                                setEstimate({
                                    ..._estimate,
                                    lineItems: [...lineItems, {}]
                                })
                            }}
                        />} /> */}
                        {_tabs.map((tab) => <Route path={tab.path} element={tab.element} />)}
                    </Routes>

                </Box>
            </Paper>
        </EstimateSingleProvider>
    )
}
