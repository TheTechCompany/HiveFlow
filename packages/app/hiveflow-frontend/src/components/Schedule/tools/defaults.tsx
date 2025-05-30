import { useState } from "react";
import { useSchedule } from "../context";
import { ContentCut, Navigation, ViewTimeline } from '@mui/icons-material';
import { useDateToScreen, useScreenToDate } from "../utils";
import { isEqual } from "lodash";
import { ROW_ITEM_RADIUS } from "../row";
export const DEFAULT_TOOLS = [
    {
        name: 'select',
        icon: <Navigation />,
        use: () => {

            const { updateEvent, selected, changeSelection } = useSchedule();
            const dateToScreen = useDateToScreen();
            const screenToDate = useScreenToDate();

            return {

                listeners: {
                    onMouseEnter: (target: any, e: any) => {

                    },
                    onMouseDown: (target: any, e: any, item: any) => {

                        if (target == 'item') {

                            if (e.ctrlKey || e.shiftKey) {
                                if (selected.indexOf(item.id) > -1) {
                                    let newSelection = selected.slice().filter((a) => a != item.id)
                                    changeSelection(newSelection)
                                } else {
                                    changeSelection([...selected, item.id])
                                }
                            } else {
                                if (selected.indexOf(item.id) > -1) {
                                    changeSelection([])
                                } else {
                                    changeSelection([item.id])
                                }
                            }

                            const currentTarget = e.currentTarget;

                            const start = e.clientX;

                            currentTarget.setPointerCapture(e.pointerId);

                            let move = (e: any) => {


                                let diff = e.clientX - start;

                                const { x: startX } = dateToScreen(item.start)
                                const { x: endX } = dateToScreen(item.end)

                                const startDate = screenToDate({ x: startX + diff });
                                const endDate = screenToDate({ x: endX + diff });

                                console.log({ diff, startDate, endDate, item, startX, endX })

                                updateEvent({ id: item.id, end: endDate, start: startDate }, true);

                            }

                            let up = (e) => {
                                let diff = e.clientX - start;

                                const { x: startX } = dateToScreen(item.start)
                                const { x: endX } = dateToScreen(item.end)

                                const startDate = screenToDate({ x: startX + diff });
                                const endDate = screenToDate({ x: endX + diff });

                                updateEvent({ id: item.id, end: endDate, start: startDate });

                                currentTarget.releasePointerCapture(e.pointerId);

                                currentTarget.removeEventListener('mousemove', move);
                                currentTarget.removeEventListener('mouseup', up);
                            }

                            currentTarget.addEventListener('mousemove', move);
                            currentTarget.addEventListener('mouseup', up);
                        }
                    },
                    onMouseMove: (target: any, e: any) => {

                    },
                    onMouseLeave: (target: any, e: any) => {

                    }
                }
            }
        }
    },
    {
        name: 'timeline',
        icon: <ViewTimeline />,
        use: () => {

            const [activeDrag, setActiveDrag] = useState<any>(null);

            const [hoverPos, setHoverPos] = useState<any>(null);
            const [hoverRow, setHoverRow] = useState<any>(null);

            const { createEvent, timelinePosition } = useSchedule();

            const screenToDate = useScreenToDate();

            return {
                component: (item: any) => {


                    return [
                        hoverPos && isEqual(item, hoverRow) && (
                            <div style={{ position: 'absolute', left: hoverPos?.x - timelinePosition?.x, height: '100%', width: '1px', background: 'black' }} />
                        ),
                        activeDrag && isEqual(item, hoverRow) && (
                            <div style={{
                                position: 'absolute',
                                left: activeDrag?.start - timelinePosition?.x,
                                width: (hoverPos?.x - activeDrag?.start) + 'px',
                                height: '100%',
                                borderRadius: ROW_ITEM_RADIUS,
                                background: 'rgba(127, 127, 127, 0.5)'
                            }}>

                            </div>
                        )
                    ]
                },
                listeners: {
                    onMouseEnter: (target: any, e: any, item: any) => {
                        if (target == 'item') e.stopPropagation();
                        if (target == 'row') {
                            console.log("ENTER ROW", item)
                            setHoverPos({ x: e.clientX, y: e.clientY })
                            setHoverRow(item)
                        }
                    },
                    onMouseDown: (target: any, e: any, row: any) => {
                        if (target == 'row') {
                            const currentTarget = e.currentTarget;

                            const start: number = e.clientX;
                            setActiveDrag({
                                start
                            })

                            currentTarget.setPointerCapture(e.pointerId);

                            let move = (e: any) => {
                                setHoverPos({ x: e.clientX, y: e.clientY })
                            }

                            let up = (e) => {
                                createEvent({
                                    start: screenToDate({ x: start - timelinePosition.x }),
                                    end: screenToDate({ x: e.clientX - timelinePosition.x }),
                                    groupBy: row?.events?.[0]?.groupBy

                                })

                                setActiveDrag(null);

                                currentTarget.releasePointerCapture(e.pointerId);

                                currentTarget.removeEventListener('mousemove', move);
                                currentTarget.removeEventListener('mouseup', up);
                            }

                            currentTarget.addEventListener('mousemove', move);
                            currentTarget.addEventListener('mouseup', up);
                        }
                    },
                    onMouseUp: (target: any, e: any) => {

                    },
                    onMouseMove: (target: any, e: any) => {
                        if (target == 'row') {
                            if (!isNaN(e.clientX) && !isNaN(e.clientY)) setHoverPos({ x: e.clientX, y: e.clientY })
                            // if(activeDrag){
                            //     setA
                            // }
                        }
                    },
                    onMouseLeave: (target: any, e: any) => {
                        if (target == 'row') {
                            setHoverPos(null)
                            setHoverRow(null)
                        }
                    },
                }
            }
        }
    },
    {
        name: 'cut',
        icon: <ContentCut />,
        use: () => {
            const { timelinePosition } = useSchedule();
            const [hoverPos, setHoverPos] = useState<any>(null);
            const [hoverRow, setHoverRow] = useState<any>(null);

            return {
                component: (item: any) => {
                    return hoverPos && isEqual(item, hoverRow) && (
                        <div style={{ zIndex: 99, cursor: 'pointer', position: 'absolute', left: hoverPos?.x - timelinePosition?.x, height: '100%', width: '1px', background: 'black' }} />
                    )
                },
                listeners: {
                    onMouseEnter: (target: any, e: any, item: any) => {
                        setHoverPos({ x: e.clientX, y: e.clientY })
                        if (target == 'row') setHoverRow(item)
                    },
                    onMouseMove: (target: any, e: any) => {
                        setHoverPos({ x: e.clientX, y: e.clientY })
                    },
                    onMouseLeave: (target: any, e: any) => {
                        if (target == 'row') setHoverPos(null)
                    },
                }
            }
        }
    }
]
