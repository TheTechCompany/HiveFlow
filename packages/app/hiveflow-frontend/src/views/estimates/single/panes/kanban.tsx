import { AvatarList, Kanban } from "@hexhive/ui";
import React, { useContext, useEffect, useState } from "react";
import { Subject } from '@mui/icons-material'
import { Box, Paper, Typography } from '@mui/material'
import { EstimateSingleContext } from "../context";
import { stringToColor } from "@hexhive/utils";

export const KanbanPane = () => {

    const { tasks, updateTaskStatus, createTask, finishTtl, updateTask } = useContext(EstimateSingleContext)

    const [ kanbanTasks, setTasks ] = useState<any[]>([]);

    const STATUS = ["Backlog", "In Progress", "Reviewing", "Finished"];

    useEffect(() => {
        setTasks(tasks || [ ])
    }, [JSON.stringify(tasks)])

    console.log({tasks})

    return (
        <Box sx={{flex: 1, display: 'flex', bgcolor: '#bfbfbf'}}>
        <Kanban
            onSelectCard={(card) => {
                console.log({card})
                updateTask({
                    ...card,
                    start: new Date(card.startDate),
                    end: new Date(card.endDate)
                })
            }}
            onCreateCard={(col) => {
                createTask({
                    status: col,
                    start: new Date(),
                    end: new Date()
                })
            }}
            onDrag={(result) => {
                console.log({result})

                // result.
                const status = STATUS[parseInt(result.destination?.droppableId)]

                updateTaskStatus(result.draggableId, result.destination?.index, status)

                let newTasks = kanbanTasks.slice()

                let ix = newTasks.map((x) => x.id).indexOf(result.draggableId)

                newTasks[ix] ={
                    ...newTasks[ix],
                    status: status
                };
                setTasks(newTasks)

            // console.log(result.destination?.droppableId)
            // if (result.destination?.droppableId != undefined) {
            //     let f = files.slice()
            //     let f_ix = f.map((x) => x.id).indexOf(result.draggableId)
            //     f[f_ix].status = STATUS[parseInt(result.destination?.droppableId || '')]
            //     setFiles(f)

            //     const loaded = UseLoading(result.draggableId)

            //     // updateFile({args: {id: result.draggableId, status: STATUS[parseInt(result.destination?.droppableId)]}}).then(() => {

            //     //   loaded()
            //     //   setLoadingFiles(f)
            //     // })


            //     /*  utils.job.updateFile(job_id, result.draggableId, {status: STATUS[parseInt(result.destination?.droppableId)]}).then(() => {
            //         //TODO reset if error  
            //     })*/

            // }
            }}
            renderCard={(item) => {
                return (
                    <Paper sx={{ /* background: stringToColor(item.title), */ background: '#aaa', minHeight: '24px', color: 'black', flexDirection: 'column', display: 'flex', padding: '6px', marginTop: '6px'}}>
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
                    </Paper>
                )
            }}
            columns={STATUS.map((x) => {
                let rows = kanbanTasks.filter((a) => a.status == x)?.map((x) => ({...x, id: x.id, name: x.title}))?.sort((a, b) => a.columnRank?.localeCompare(b.columnRank)) //files.filter((a: any) => a.status == x).map((x) => ({ ...x }))

                if(x == 'Backlog') {
                    rows = rows.filter((a) => a.dependencyOn?.length < 1 || a.dependencyOn?.map((x) => x.status == "Reviewing" || x.status == "Finished")?.indexOf(true) > -1)
                }

                return {
                    id: x,
                    title: x,
                    ttl: x == "Finished" ? finishTtl : undefined,
                    menu: [
                        { label: "Archive all cards", onClick: () => { } },
                        {
                        label: "Column Settings", onClick: () => {
                            // showKanbanMenu(true)
                            // setSelectedColumn(x)
                        }
                        }
                    ],
                    rows: rows 
                }
            })} />
        </Box>
    )
}