import { Kanban } from "@hexhive/ui";
import React, { useContext, useEffect, useState } from "react";
import { Box, Paper } from '@mui/material'
import { ProjectSingleContext } from "../context";

export const KanbanPane = () => {

    const { tasks, updateTaskStatus, createTask, updateTask } = useContext(ProjectSingleContext)

    const [ kanbanTasks, setTasks ] = useState<any[]>([]);

    const STATUS = ["Backlog", "In Progress", "Reviewing", "Finished"];

    useEffect(() => {
        setTasks(tasks)
    }, [JSON.stringify(tasks)])

    console.log({tasks})

    return (
        <Box sx={{flex: 1, display: 'flex', bgcolor: '#bfbfbf'}}>
        <Kanban
            onSelectCard={(card) => {
                console.log({card})
                updateTask(card)
            }}
            onCreateCard={(col) => {
                createTask({status: col})
            }}
            onDrag={(result) => {
                console.log({result})

                const status = STATUS[parseInt(result.destination?.droppableId)]

                updateTaskStatus(result.draggableId, status)

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
                    <Paper sx={{padding: '6px', marginTop: '6px'}}>
                        {item.name || item.title}
                    </Paper>
                )
            }}
            columns={STATUS.map((x) => {
                let rows = kanbanTasks.filter((a) => a.status == x)?.map((x) => ({...x, id: x.id, name: x.title})) //files.filter((a: any) => a.status == x).map((x) => ({ ...x }))

                if(x == 'Backlog') {
                    rows = rows.filter((a) => a.dependencyOn?.map((x) => x.status == "Reviewing" || x.status == "Finished")?.indexOf(false) < 0)
                }

                return {
                    id: x,
                    title: x,
                    ttl: x == "Finished" ? 14 * 24 * 60 * 60 * 1000 : undefined,
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