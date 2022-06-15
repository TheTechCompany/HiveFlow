import { Kanban } from "@hexhive/ui";
import React from "react";

export const KanbanPane = () => {
    const STATUS = ["Backlog", "In Progress", "Reviewing", "Finished"];

    return (
        <Kanban
            onDrag={(result) => {
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
                <></>
                // <Box
                // onClick={() => {
                //     setShowFiles([item])
                //     openDialog(true)
                // }}
                // direction="column"
                // background="light-2"
                // round="xsmall"
                // pad="small">
                // <Text>{item.name}</Text>
                // </Box>
            )
            }}
            columns={STATUS.map((x) => ({
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
            rows:  [] //files.filter((a: any) => a.status == x).map((x) => ({ ...x }))
            }))} />
    )
}