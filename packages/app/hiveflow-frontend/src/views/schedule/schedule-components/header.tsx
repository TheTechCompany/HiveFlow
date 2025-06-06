import { Box, Menu, MenuItem } from "@mui/material";
import { useRootSchedule } from "../context";
import { useState } from "react";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
    popOverRoot: {
        pointerEvents: "none"
    }
}));

//  (calendarData: any, rowOptions: any, headerCapacity: any, setHeaderCapacity: any, headerHeight: any, setHeaderHeight: any, headerHandle: any, setHeaderHandle: any, graphType: string) => 
export const SchedulerHeaderItem = (header: any) => {

    const styles = useStyles();

    const {
        events,
        rowOptions,
        people,
        horizon,
        graphType
    } = useRootSchedule();

    const [hoverInfo, setHoverInfo] = useState<any>(null);

    if (graphType == 'Capacity') {

        const scheduled = events?.filter((item) => {
            return new Date(item.start)?.getTime() < header.end?.getTime() && new Date(item.end) > header.start?.getTime();
        }).length

        let project_options = rowOptions.filter((project) => {
            return project.tasks.filter((task) => {
                return new Date(task.endDate)?.getTime() > header.start?.getTime() && new Date(task.startDate)?.getTime() < header.end?.getTime();
            }).length > 0;
        }).length;

        if (header.data[header.start + '-' + header.end]?.scheduled != scheduled ||
            header.data[header.start + '-' + header.end]?.project_options != project_options
        ) {
            header.setData({
                ...header.data,
                [header.start + '-' + header.end]: {
                    scheduled,
                    project_options
                }
            })
        }

        const max_scheduled = Math.max(...Object.keys(header.data).map((x) => header.data[x]?.scheduled));
        const max_project_options = Math.max(...Object.keys(header.data).map((x) => header.data[x]?.project_options));
        const max = Math.max(max_scheduled, max_project_options)

        // projects.filter((prev, curr) => {
        //   prev.concat(curr.tasks.map((task) => ({ ...task, startDate: new Date(task.startDate), endDate: new Date(task.endDate), project: curr }))), [])
        // tasks = tasks.filter((task) => {
        //   return task.endDate?.getTime() > header.start?.getTime() && task.startDate?.getTime() < header.end?.getTime();
        // })

        const scheduledAmount = scheduled / max;
        const projectAmount = project_options / max;

        return (
            <div>
                <div style={{
                    height: header.height,
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'relative',
                }}>

                    {(!isNaN(scheduledAmount) && !isNaN(projectAmount)) && <>
                        <div style={{
                            position: 'absolute',
                            width: '50%',
                            height: (scheduledAmount * 100) + '%',
                            bottom: 0,
                            borderTopRightRadius: '12px',
                            borderTopLeftRadius: '12px',
                            background: 'rgba(0, 127, 0, 1)',
                            zIndex: scheduledAmount > projectAmount ? 1 : 2
                        }} />
                        <div style={{
                            position: 'absolute',
                            width: '50%',
                            height: (projectAmount * 100) + '%',
                            bottom: 0,
                            borderTopRightRadius: '12px',
                            borderTopLeftRadius: '12px',
                            background: '#dfdfdf',
                            zIndex: projectAmount > scheduledAmount ? 1 : 2

                        }} />
                    </>
                    }
                    {/* header */}
                </div>

            </div>
        )

    } else if (graphType == 'Unassigned') {


        const scheduled = (events || []).filter((item) => {
            return new Date(item.start)?.getTime() < header.end?.getTime() && new Date(item.end) > header.start?.getTime();
        })

        let people_ids = [...new Set(scheduled.map((x) => x.data.people).reduce((prev, curr) => prev.concat(curr), []))]
        let available_people = people.filter((person) => {
            return person.leave.filter((leave_item) => {
                return new Date(leave_item.start)?.getTime() < header?.end?.getTime() && new Date(leave_item.end)?.getTime() > header?.start?.getTime();
            }).length == 0
        })

        console.log({ people, available_people })

        let unassigned = available_people.filter((a) => people_ids.indexOf(a.id) < 0)

        return (
            <div>
                <Box sx={{
                    height: header.height,
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'relative',
                }}>
                    <div
                        onMouseEnter={(e) => {
                            setHoverInfo(e.currentTarget)
                        }}
                        onMouseLeave={() => {
                            setHoverInfo(null)
                        }}
                        style={{
                            position: 'absolute',
                            width: '50%',
                            height: (((unassigned.length) / people.length) * 100) + '%',
                            bottom: 0,
                            borderTopRightRadius: '12px',
                            borderTopLeftRadius: '12px',
                            background: '#dfdfdf',
                            zIndex: 2

                        }} />
                    {/*                     
                    <div 
                    onMouseEnter={(e) => {
                        setHoverInfo(e.currentTarget)
                    }}
                    onMouseLeave={() => {
                        setHoverInfo(null)
                    }}
                    style={{
                        position: 'absolute',
                        width: '50%',
                        height: (((people.length - available_people.length) / people.length) * 100) + '%',
                        bottom: 0,
                        borderTopRightRadius: '12px',
                        borderTopLeftRadius: '12px',
                        background: 'red',
                        zIndex: 2

                    }} />
                     */}
                    <Menu
                        PopoverClasses={{
                            root: styles.popOverRoot
                        }}
                        slotProps={{
                            backdrop: { style: { pointerEvents: 'none' } }
                        }}
                        hideBackdrop={true}
                        onClose={() => setHoverInfo(null)}
                        open={hoverInfo != null}
                        anchorEl={hoverInfo}>
                        {unassigned.map((person) => {

                            return (
                                <MenuItem>{person.name}</MenuItem>
                            )
                        })}
                    </Menu>
                    {/* Unassigned {total_people.length-people_ids.length}/{total_people.length} */}

                </Box>

            </div>
        )
    }
}