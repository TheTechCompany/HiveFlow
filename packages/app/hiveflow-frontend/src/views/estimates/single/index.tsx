import { gql, useApolloClient, useQuery } from '@apollo/client';
import { Box, Button, IconButton, Paper, Tab, Tabs, Typography } from '@mui/material';
import { ChevronLeft as Previous, Download } from '@mui/icons-material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import Spreadsheet, { createEmptyMatrix } from "react-spreadsheet";
import { QuoteBuilder } from '../../../components/QuoteBuilder';
import { client, refetch, useMutation } from '@hive-flow/api';
import { debounce, throttle } from 'lodash';
import { KanbanPane, TimelinePane } from './panes';
import { EstimateSingleProvider } from './context';
import { TaskModal } from '../../../modals/new-task';
import { arrayMove } from '@dnd-kit/sortable';

export const EstimateSingle = (props) => {
    
    const [ selectedTask, setSelectedTask ] = useState<any>();
    const [taskModalOpen, openTaskModal] = useState(false);

    const navigate = useNavigate()
    const { id } = useParams()

    const client = useApolloClient();

    const { data } = useQuery(gql`
        query EstimateSingle($displayId: String){
            users (active: true) {
                id
                name
              }

              
            estimates(where: {displayId: $displayId}) {
                id
                displayId
                name
                status

                tasks {
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
          
                    lastUpdated
          
                    dependencyOn {
                      id
                      title
                      status
                      endDate
                    }
                    dependencyOf {
                      id
                      title
                      status
                      endDate
                    }
                }

                lineItems {
                    id
                    order
                    item
                    description
                    price
                    quantity
                    amount
                }
            }
        }
    `, {
        variables: {
            displayId: id
        }
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

    const lineItems = estimate?.lineItems || [];

    const [createLineItem] = useMutation((mutation, args: { input: any }) => {
        const item = mutation.createEstimateLineItem({
            estimate: id, input: {
                ...args.input
            }
        })
        return {
            item: {
                ...item
            }
        }
    })

    const [updateLineItem] = useMutation((mutation, args: { id: string, input: any }) => {
        const item = mutation.updateEstimateLineItem({
            estimate: id, id: args.id, input: {
                ...args.input
            }
        })
        return {
            item: {
                ...item
            }
        }
    })

    const debouncedUpdate = useMemo(() => debounce((args: any) => {
        updateLineItem(args).then(() => {
            refetch()
        })
    }, 1000), [])

    // const {cancel: cancelDebounce} = debouncedUpdate;

    const [deleteLineItem] = useMutation((mutation, args: { id: string }) => {
        const item = mutation.deleteEstimateLineItem({ estimate: id, id: args.id })
        return {
            item: {
                ...item
            }
        }
    })


    const [createTask] = useMutation((mutation, args: any) => {
        const item = mutation.createEstimateTask({ input: args.input })
        return {
            item: {
                ...item
            }
        }
    })

    const [updateTask] = useMutation((mutation, args: any) => {
        const item = mutation.updateEstimateTask({ id: args.id, input: args.input })
        return {
            item: {
                ...item
            }
        }
    })

    const [deleteTask] = useMutation((mutation, args: any) => {
        const item = mutation.deleteEstimateTask({ id: args.id })
        return {
            item: {
                ...item
            }
        }
    })


    const [ createTaskDependency ] = useMutation((mutation, args: any) => {
        const item = mutation.createEstimateTaskDependency({estimate: id, source: args.source, target: args.target});
        return {
        item: {
            ...item
        }
        }
    })


    const [ deleteTaskDependency ] = useMutation((mutation, args: any) => {
        const item = mutation.deleteEstimateTaskDependency({estimate: id, source: args.source, target: args.target});
        return {
        item: {
            ...item
        }
        }
  })

    const refetch = () => {
        client.refetchQueries({ include: ['EstimateSingle'] })
    }

    const _tabs = [
        // {

        // }
        {
            title: "Tickets",
            path: "tickets",
            element: <KanbanPane />
        },
        {
            title: "Timeline",
            path: "timeline",
            element: <TimelinePane />
        },
    ]

    const { pathname } = useLocation()

    const view = _tabs.find((a) => pathname.indexOf(a.path) > -1)?.path

    return (
        <EstimateSingleProvider value={{
            estimateId: id,
            tasks: _estimate?.tasks || [],
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

                statusTasks = arrayMove(statusTasks, ix, index)

                let above = statusTasks?.[index - 1]?.id;
                let below = statusTasks?.[index + 1]?.id
        
                  updateTask({
                    args: {
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
                args: {
                  source,
                  target
                }
              }).then(() => {
                refetch();
              })
            },
            createDependency: (source: string, target: string) => {
              createTaskDependency({
                args: {
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
                      args: {
                        id: selectedTask?.id
                      }
                    })
                    refetch();
          
                    setSelectedTask(null)
                    openTaskModal(false)
                    
                  }}
                  selected={selectedTask}
                  onSubmit={async (task) => {
                    if(task.id){
                      //Update
                      await updateTask({
                        args: { 
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
                        args: {
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
                  }}
                onClose={() => openTaskModal(false)} />
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
                                    args: {
                                        id: id,
                                        input: {
                                            [key]: value
                                        }
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
                                    args: {
                                        id: id
                                    }
                                }).then(() => {
                                    refetch()
                                })
                            }}
                            onAddRow={() => {
                                createLineItem({
                                    args: {
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