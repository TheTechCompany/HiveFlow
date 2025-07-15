/*
    Schedule lane

    Renders a lane of calendar entries
    Can be nested to show overlapping ranges

    Root
        groupBy lane 1
        groupBy lane 2
            overlap lane 1
            overlap lane 2
        groupBy lane 3
            overlap lane 1
*/
import { ScheduleEvent } from "../types";
import { LaneItem } from "./item";
import { useDateToScreen, useScreenToDate } from "../utils";
import { EventHeightProxy, EventLaneProxy, RowHeightProxy, useRowHeights, useSchedule, useTool } from "../context";
import { useEffect, useMemo, useState } from "react";
import { useSnapshot } from "valtio";


export interface LaneProps {
    id: string;

    lane?: any;

    events?: ScheduleEvent[];
    renderItem?: (event: ScheduleEvent & { expanded?: boolean, selected?: boolean }) => any;
    expanded?: boolean
}

export const Lane: React.FC<LaneProps> = (props) => {

    const { selected, onClickEvent, onDoubleClickEvent } = useSchedule();
    const { updateRowHeight } = useRowHeights();

    const rowHeights = useSnapshot(RowHeightProxy)
    const eventHeights = useSnapshot(EventHeightProxy);
    const eventLanes = useSnapshot(EventLaneProxy)


    const dateToScreen = useDateToScreen();

    const [measured, setMeasured] = useState<any[]>([]);
    const [maxHeight, setMaxheight] = useState<any>(null);

    const measuredAll = useMemo(() => {
        return props.events.length == props.events.map((x) => eventHeights[x.id]).filter((a) => a != undefined).length
    }, [eventHeights, props.events])

    const { activeTool } = useTool();

    const layers = [...new Set(props.events.map((x) => x.zIndex))]

    const layerEvents = useMemo(() => {
        
        return layers.sort((a, b) => a - b).map((layer) => {
            const events = props.events?.filter((a) => a.zIndex == layer)
            const sorted = [...events].sort((a, b) => {
                return new Date(a.start).getTime() - new Date(b.start).getTime()
            });

            const lanes: any[][] = []; // Each sub-array is a lane, containing events

            for (const event of sorted) {
                let placed = false;
                for (const lane of lanes) {
                    const hasOverlap = lane.some(existingEvent =>
                        new Date(event.start) < new Date(existingEvent.end) && new Date(event.end) > new Date(existingEvent.start)
                    );
                    if (!hasOverlap) {
                        //Add to lane if not overlapping
                        lane.push(event);
                        placed = true;
                        break;
                    }
                }
                if (!placed) {
                    //Start a new lane
                    lanes.push([event]);
                }
            }

            const laneHeights = lanes.map((lane, laneIndex) => {
                return {
                    lane: laneIndex,
                    height: Math.max(...lane.map((event) => eventHeights?.[event.id]))
                }
            })

            console.log({laneHeights})
            
            return {
                layer,
                events: lanes.map((lane, laneIndex) => lane.map((event) => ({ ...event, laneIndex }))).flat(),
                heights: laneHeights
            }
        })
    }, [props.events, eventHeights])

    useEffect(() => {
        let maxHeight = null;
        layerEvents.forEach((layer) => {
            let height = layer.heights.reduce((prev, curr) => prev + curr.height, 0)
            if(height > maxHeight) maxHeight = height;
        })
        if(maxHeight != null){
            RowHeightProxy[props.id] = maxHeight;
        }
    }, [layerEvents])

    const renderEvents = (events: ScheduleEvent[], heights: any[]) => {
        return events.sort((a: any, b: any) => a.laneIndex - b.laneIndex).map((event: any, ix) => {
            let lastIndex = (event.laneIndex) || 0
            const offsetY = heights.sort((a, b) => a.laneIndex - b.laneIndex).slice(0, lastIndex).reduce((p, c, cI) => p+c.height, 0)
            console.log("OFFSET", offsetY, heights, event.laneIndex, lastIndex)
            return renderEvent(event, event.laneIndex, heights.find((a) => a.lane == event.laneIndex).height, offsetY)
        })
    }

    const renderEvent = (event: ScheduleEvent, lane: number, maxHeight: number, offsetY: number) => {
        const { x } = dateToScreen(event.start);
        const { x: endX } = dateToScreen(event.end);
        const isSelected = selected?.indexOf(event.id) > -1;

        const height = undefined //measuredAll ? maxHeight : undefined //eventHeights?.[event.id] : undefined;

        return <LaneItem
            lane={lane}
            key={event.id}
            id={event.id}
            start={event.start}
            end={event.end}
            resizable={event.resizable}
            left={x}
            top={offsetY}
            width={endX - x}
            height={height}
            selected={isSelected}
            onMeasure={(sizes, forced) => {
                console.log({sizes, forced})
                // if(!forced){
                    EventHeightProxy[event.id] = sizes.height

                    // setMaxheight((height) => {
                    //     let newHeight = height;
                    //     if (height == undefined || sizes?.height > height) {
                    //         newHeight = sizes?.height
                    //     }
                    //     setMeasured((measured) => {
                    //         if(measured.length == props.events.length -1){
                    //             console.log("MEasure", newHeight, sizes, measured, props.events)


                    //             // updateRowHeight(props.id, newHeight)
                    //         }
                    //         return [...measured, event.id]
                    //     })
                    //     return newHeight
                    // })
                    setMeasured((measured) => {
                        return [...measured, event.id]
                    })
                // }
            }}
            onClick={() => onClickEvent?.(event)}
            onDoubleClick={() => onDoubleClickEvent?.(event)}
            onPointerDown={(e) => {
                activeTool?.listeners?.onPointerDown?.('item', e, event)
            }}
            onMouseDown={(e) => {
                activeTool?.listeners?.onMouseDown?.('item', e, event);
            }}
            onMouseUp={(e) => {
                activeTool?.listeners?.onMouseUp?.('item', e, event);
            }}
            onMouseEnter={(e) => {
                activeTool?.listeners?.onMouseEnter?.('item', e, event);
            }}
            onMouseMove={(e) => {
                activeTool?.listeners?.onMouseMove?.('item', e, event);
            }}>
            {props.renderItem?.({ ...event, expanded: props.expanded, selected: isSelected })}
        </LaneItem>
    }

    return (
        <div
            className="lane"
            style={{
                position: 'relative',
                width: '100%',
                height: measuredAll ? rowHeights?.[props.id] || '30px' : undefined
            }}
            onMouseEnter={(e) => {
                activeTool?.listeners?.onMouseEnter?.('row', e, props.lane)
            }}
            onMouseMove={(e) => {
                activeTool?.listeners?.onMouseMove?.('row', e, props.lane);
            }}
            onMouseLeave={(e) => {
                activeTool?.listeners?.onMouseLeave?.('row', e, props.lane);
            }}
            onMouseDown={(e) => {
                activeTool?.listeners?.onMouseDown?.('row', e, props.lane);
            }}
            onPointerDown={(e) => {
                activeTool?.listeners?.onPointerDown?.('row', e, props.lane)
            }}
            onMouseUp={(e) => {
                activeTool?.listeners?.onMouseUp?.('row', e, props.lane);
            }}>
            {activeTool?.component?.(props.lane)}

            {layerEvents.map((layer) => (
                <div key={layer.layer} style={{ zIndex: layer.layer }}>
                    {renderEvents(layer.events, layer.heights)}
                </div>
            ))}
        </div>
    )
}