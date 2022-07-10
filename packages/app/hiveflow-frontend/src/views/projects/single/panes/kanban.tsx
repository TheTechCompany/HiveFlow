import { Kanban } from "@hexhive/ui";
import React, { useContext } from "react";
import { Box, Paper } from '@mui/material'
import { ProjectSingleContext } from "../context";

export const KanbanPane = () => {

    const { tasks, updateTaskStatus } = useContext(ProjectSingleContext)

    const STATUS = ["Backlog", "In Progress", "Reviewing", "Finished"];

    console.log({tasks})

    return (
        <Box sx={{flex: 1, display: 'flex', bgcolor: '#bfbfbf'}}>
        <Kanban
            onDrag={(result) => {
                console.log({result})

                const status = STATUS[parseInt(result.destination?.droppableId)]

                updateTaskStatus(result.draggableId, status)
                
            console.log(result.destination?.droppableId)
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
                const rows = tasks.filter((a) => a.status == x)?.map((x) => ({id: x.id, name: x.title})) //files.filter((a: any) => a.status == x).map((x) => ({ ...x }))
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
                    rows:rows 
                }
            })} />
        </Box>
    )
}