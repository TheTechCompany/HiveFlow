import { useEffect, useRef, useState } from "react";
import { useSchedule } from "../context";
import { ContentCut, Navigation, ViewTimeline } from '@mui/icons-material';
import { useDateToScreen, useScreenToDate } from "../utils";
import { isEqual } from "lodash";
import { PlanItem, ROW_ITEM_RADIUS } from "../row";
import { getHostForElement } from "@hexhive/utils";
export const DEFAULT_TOOLS = [
    {
        name: 'select',
        icon: <Navigation />,
        use: () => {

            const { createEvent, updateEvent, expanded, selected, changeSelection, events, renderItem, pasteItems, setPasteItems, timelinePosition } = useSchedule();

            const dateToScreen = useDateToScreen();
            const screenToDate = useScreenToDate();

            const [hoverPos, setHoverPos] = useState<any>(null);

            const activePointerId = useRef<number | null>(null);
            const captureElement = useRef<HTMLElement | null>(null);

            useEffect(() => {
                if (activePointerId.current !== null && captureElement.current) {
                    try {
                        console.log("Cpature pointer")
                        if (!captureElement.current.hasPointerCapture(activePointerId.current)) {
                            captureElement.current.setPointerCapture(activePointerId.current);
                        }
                    } catch (err) {
                        console.warn('Failed to recapture pointer:', err);
                    }
                }
            }, [activePointerId.current, captureElement.current, events]);

            const cancelCallback = (e: any) => {
                if (e.key == 'Escape') {
                    setPasteItems([])
                    document.removeEventListener('keydown', cancelCallback)
                }
            }

            useEffect(() => {
                if (pasteItems.length > 0)
                    document.addEventListener('keydown', cancelCallback)

                return () => {
                    document.removeEventListener('keydown', cancelCallback)
                }
            }, [pasteItems])

            return {

                listeners: {
                    onMouseEnter: (target: any, e: any) => {
                        // if(isDragging) return
                        if (target == 'row') {
                            setHoverPos(e.clientX);
                        } else {
                            e.stopPropagation();
                        }
                    },
                    onPointerDown: (target: any, e: any, item: any) => {
                        if (pasteItems.length > 0) {
                            if (target == 'row') {
                                let x = hoverPos - timelinePosition.x;

                                const positions = pasteItems.map((x) => {

                                    const { x: startX } = dateToScreen(x.start)
                                    const { x: endX } = dateToScreen(x.end)
                                    return {
                                        startX,
                                        endX
                                    }
                                })

                                const min = Math.min(...positions.map((x) => x.startX))

                                pasteItems.map((item) => {
                                    // let item = events?.find((a) => a.id == id);
                                    const { x: startX } = dateToScreen(item.start)
                                    const { x: endX } = dateToScreen(item.end)

                                    const diff = endX - startX;

                                    //(hoverPos - timelinePosition?.x) + (startX - min)
                                    const startDate = screenToDate({ x: x + (startX - min) });
                                    const endDate = screenToDate({ x: x + (startX - min) + diff  });


                                    createEvent({ ...item, end: endDate, start: startDate, }, true);

                                })

                                setPasteItems([])
                                return;
                            } else {
                                // e.stopPropagation();
                                return;
                            }
                        }

                        if (target == 'item' && item.selectable != false) {
                            e.stopPropagation();

                            let moved = false;
                            let newSelection = selected?.slice();

                            if (e.metaKey || e.ctrlKey || e.shiftKey) {
                                if (selected.indexOf(item?.id) > -1) {
                                    newSelection = selected.slice().filter((a) => a != item.id)
                                } else {
                                    newSelection = [...selected, item.id];
                                }
                            } else {
                                if (selected.indexOf(item?.id) > -1) {
                                    // changeSelection([])
                                } else {
                                    newSelection = [item?.id];
                                }
                            }
                            
                            if(!isEqual(selected, newSelection)) changeSelection(newSelection)

                            const startX = e.clientX;
                            activePointerId.current = e.pointerId;
                            captureElement.current = e.currentTarget;

                            const cleanup = () => {
                                try {
                                    if (captureElement.current && activePointerId.current !== null) {
                                        captureElement.current.releasePointerCapture(activePointerId.current);
                                         captureElement.current.removeEventListener('pointermove', move);
                                        captureElement.current.removeEventListener('pointerup', up);
                                        captureElement.current.removeEventListener('pointercancel', cleanup);
                                    }
                                    activePointerId.current = null;
                                    captureElement.current = null
                                } catch (err) {
                                    console.warn('Cleanup error:', err);
                                }
                            };

                            const move = (e: any) => {
                                let diff = e.clientX - startX;
                                console.log("Moving element");

                                if(diff != 0){
                                    newSelection.map((id) => {
                                        let item = events?.find((a) => a.id == id);

                                        if (!item) return;
                                        const { x: startX } = dateToScreen(item?.start)
                                        const { x: endX } = dateToScreen(item?.end)

                                        const startDate = screenToDate({ x: startX + diff });
                                        const endDate = screenToDate({ x: endX + diff });

                                        updateEvent({ id: item?.id, end: endDate, start: startDate }, true);
                                    })

                                    moved = true;
                                }
                            };

                            const up = (e: any) => {
                                e.stopPropagation();

                                let diff = e.clientX - startX;

                                newSelection.map((id) => {
                                    let item = events?.find((a) => a.id == id);
                                    if (!item) return;
                                    const { x: startX } = dateToScreen(item?.start)
                                    const { x: endX } = dateToScreen(item?.end)

                                    const startDate = screenToDate({ x: startX + diff });
                                    const endDate = screenToDate({ x: endX + diff });
                                    if (startX != e.clientX) {
                                        updateEvent({ id: item?.id, end: endDate, start: startDate });
                                    }
                                });

                                if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
                                    if (!moved) changeSelection([item.id])
                                }

                                cleanup();
                            };

                            // Set up the pointer capture and event listeners
                            try {
                                console.log("setting up listeners")

                                e.currentTarget.addEventListener('pointermove', move);
                                e.currentTarget.addEventListener('pointerup', up);
                                e.currentTarget.addEventListener('pointercancel', cleanup);
                            } catch (err) {
                                console.log("Error setting up listeners")
                                cleanup();
                            }
                        }
                    },
                    onMouseMove: (target: any, e: any) => {
                        setHoverPos(e.clientX);

                    },
                    onMouseLeave: (target: any, e: any) => {
                        setHoverPos(null)
                    },

                },
                component: (item: any) => {

                    if (pasteItems.length > 0) {
                        let eventGroup = pasteItems.filter((a) => a.groupBy?.id == item.id);

                        if (eventGroup.length > 0) {

                            const positions = pasteItems.map((item) => {

                                let startX = dateToScreen(item.start).x
                                let endX = dateToScreen(item.end).x

                                return {
                                    startX,
                                    endX
                                }
                            });

                            const min = Math.min(...positions.map((x) => x.startX))


                            return eventGroup.map((item, ix) => {

                                let startX = dateToScreen(item.start).x
                                let endX = dateToScreen(item.end).x

                                return <div style={{
                                    pointerEvents: 'none',
                                    position: 'absolute',
                                    zIndex: 99,
                                    // height: '30px',
                                    minHeight: '100%',
                                    left: (hoverPos - timelinePosition?.x) + (startX - min),
                                    width: endX - startX
                                }}>
                                    {renderItem({ ...item, expanded: expanded.indexOf(item.groupBy?.id) > -1 })}
                                </div>
                            })

                        }
                    }

                    // if(startDragging != null && selected.length > 0){
                    //     let selectedEvents = selected.map((item) => events.find((a) => a.id == item))
                    //     let eventGroup = selectedEvents.filter((a) => a.groupBy?.id == item.id);
                    //     if (eventGroup.length > 0) {

                    //         const positions = selectedEvents.map((item) => {

                    //             let startX = dateToScreen(item.start).x
                    //             let endX = dateToScreen(item.end).x

                    //             return {
                    //                 startX,
                    //                 endX
                    //             }
                    //         });

                    //         const min = Math.min(...positions.map((x) => x.startX))


                    //         return eventGroup.map((item, ix) => {

                    //             let startX = dateToScreen(item.start).x
                    //             let endX = dateToScreen(item.end).x

                    //             return <div style={{
                    //                 pointerEvents: 'none',
                    //                 position: 'absolute',
                    //                 zIndex: 99,
                    //                 // height: '30px',
                    //                 minHeight: '100%',
                    //                 left: (hoverPos - timelinePosition?.x) - startDragging + (startX - min),
                    //                 width: endX - startX
                    //             }}>
                    //                 {renderItem({ ...item, expanded: expanded.indexOf(item.groupBy?.id) > -1 })}
                    //             </div>
                    //         })

                    //     }
                    // }
                    return null;
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

            const { createEvent, timelinePosition, copyItems, pasteItems } = useSchedule();

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
                                background: 'rgba(127, 127, 127, 0.5)',
                                zIndex: 99
                            }}>

                            </div>
                        )
                    ]
                },
                listeners: {
                    onMouseEnter: (target: any, e: any, item: any) => {
                        if (target == 'item') e.stopPropagation();
                        if (target == 'row') {
                            setHoverPos({ x: e.clientX, y: e.clientY })
                            setHoverRow(item)
                        }
                    },
                    onPointerDown: (target: any, e: any, row: any) => {
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

                                currentTarget.removeEventListener('pointermove', move);
                                currentTarget.removeEventListener('pointerup', up);
                            }

                            currentTarget.addEventListener('pointermove', move);
                            currentTarget.addEventListener('pointerup', up);
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
    // {
    //     name: 'cut',
    //     icon: <ContentCut />,
    //     use: () => {
    //         const { timelinePosition } = useSchedule();
    //         const [hoverPos, setHoverPos] = useState<any>(null);
    //         const [hoverRow, setHoverRow] = useState<any>(null);

    //         return {
    //             component: (item: any) => {
    //                 return hoverPos && isEqual(item, hoverRow) && (
    //                     <div style={{ zIndex: 99, cursor: 'pointer', position: 'absolute', left: hoverPos?.x - timelinePosition?.x, height: '100%', width: '1px', background: 'black' }} />
    //                 )
    //             },
    //             listeners: {
    //                 onMouseEnter: (target: any, e: any, item: any) => {
    //                     setHoverPos({ x: e.clientX, y: e.clientY })
    //                     if (target == 'row') setHoverRow(item)
    //                 },
    //                 onMouseMove: (target: any, e: any) => {
    //                     setHoverPos({ x: e.clientX, y: e.clientY })
    //                 },
    //                 onMouseLeave: (target: any, e: any) => {
    //                     if (target == 'row') setHoverPos(null)
    //                 },
    //             }
    //         }
    //     }
    // }
]


export const PASTE = {

}