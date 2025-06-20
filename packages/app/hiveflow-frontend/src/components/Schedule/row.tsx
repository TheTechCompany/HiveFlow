import { Box } from "@mui/material";
import { useDateToScreen, useScreenToDate } from "./utils";
import { useRowHeights, useSchedule, useTool } from "./context";
import useResizeAware from "react-resize-aware";
import { useEffect, useState } from "react";

export const ROW_ITEM_CONTAINER = '30px';
export const ROW_ITEM_RADIUS = '12px';

export interface RowProps {
    filled?: boolean;

    row?: any;

    events?: any[];
    onEventsChanged?: (events: any[]) => void;

    expanded?: boolean;
    expandedContent?: any;

    renderItem?: (event: any) => any;
}


export const Row: React.FC<RowProps> = ({ renderItem, row: rowTemplate, expanded, filled = false, events = [], onEventsChanged }) => {

    const dateToScreen = useDateToScreen();
    const { activeTool } = useTool();
    const { updateRowHeight, rowHeights } = useRowHeights();
    const { selected, horizon } = useSchedule();

    const [sizes, setSizes] = useState<any>(null)
    const [ allSizes, setAllSizes ] = useState<any>({});

    const rowKey = `${rowTemplate?.id}`
    

    useEffect(() => {
        if(rowHeights[rowKey] != sizes?.height){
            updateRowHeight(rowKey, sizes?.height)
        }
    }, [JSON.stringify(rowTemplate), JSON.stringify(rowHeights), JSON.stringify(sizes)])

    return (
        <Box

            sx={{
                position: 'relative',
                borderBottom: filled ? '1px solid black' : '1px solid #dfdfdf',
                display: 'flex',
                alignItems: 'center',
                height: rowHeights[rowKey] || ROW_ITEM_CONTAINER, //expanded ? undefined : ROW_ITEM_CONTAINER,
                width: '100%',
            }}

            onMouseEnter={(e) => {
                activeTool?.listeners?.onMouseEnter?.('row', e, rowTemplate)
            }}
            onMouseMove={(e) => {
                activeTool?.listeners?.onMouseMove?.('row', e, rowTemplate);
            }}
            onMouseLeave={(e) => {
                activeTool?.listeners?.onMouseLeave?.('row', e, rowTemplate);
            }}
            onMouseDown={(e) => {
                activeTool?.listeners?.onMouseDown?.('row', e, rowTemplate);
            }}
            onPointerDown={(e) => {
                activeTool?.listeners?.onPointerDown?.('row', e, rowTemplate)
            }}
            onMouseUp={(e) => {
                activeTool?.listeners?.onMouseUp?.('row', e, rowTemplate);
            }}
        >

            {activeTool?.component?.(rowTemplate)}

            {events.map((event) => {

                const { x } = dateToScreen(event.start);
                const { x: endX } = dateToScreen(event.end);

                const width = endX - x;
                return <PlanItem
                    key={event.id}
                    left={x}
                    width={width}
                    selected={selected.indexOf(event.id) > -1}
                    rowHeight={rowHeights[rowKey]}
                    onResize={(itemSize) => {
                        setAllSizes((allSizes) => {
                            let newSizes = {...allSizes, [event.id]: itemSize?.height}
                            setSizes({height: Math.max(...Object.keys(newSizes).map((x) => newSizes[x])) })
                            
                            return newSizes
                        });

                        // if (!sizes?.height || itemSize?.height > sizes?.height || (event.id == sizes.id && itemSize?.height != sizes?.height)) {
                        //     setSizes({ height: itemSize.height, id: event.id })
                        // }
                    }}
                    item={event}
                    expanded={expanded}
                    renderItem={() => renderItem({ ...event, expanded, selected: selected.indexOf(event.id) > -1 })} />
            })}


        </Box>
    )
}


export const PlanItem = (props: any) => {

    const [listeners, sizes] = useResizeAware()

    const screenToDate = useScreenToDate();
    const dateToScreen = useDateToScreen();

    const { updateEvent, onClickEvent, onDoubleClickEvent } = useSchedule();
    const { activeTool } = useTool();

    useEffect(() => {
        props.onResize?.(sizes);
    }, [props.rowHeight, props.item, JSON.stringify(sizes)])

    const dragEnd = (position: string) => {
        return (e: any) => {
            e.stopPropagation();
            let start = e.clientX;
            e.target.setPointerCapture(e.pointerId);

            let move = (e: any) => {
                let diff = e.clientX - start;

                switch (position) {
                    case 'w':
                        updateEvent({ ...props.item, start: screenToDate({ x: dateToScreen(props.item.start).x + diff }) }, true)
                        break;
                    case 'e':
                        updateEvent({ ...props.item, end: screenToDate({ x: dateToScreen(props.item.end).x + diff }) }, true)
                        break;
                }
            }

            let up = (e: any) => {
                let diff = e.clientX - start;

                switch (position) {
                    case 'w':
                        updateEvent({ ...props.item, start: screenToDate({ x: dateToScreen(props.item.start).x + diff }) })
                        break;
                    case 'e':
                        updateEvent({ ...props.item, end: screenToDate({ x: dateToScreen(props.item.end).x + diff }) })
                        break;
                }
                e.target.removeEventListener('pointermove', move);
                e.target.removeEventListener('pointerup', up);
                e.target.releasePointerCapture(e.pointerId);
            }

            e.target.addEventListener('pointermove', move);
            e.target.addEventListener('pointerup', up);

        }
    }

    return (
        <div
            onClick={() => onClickEvent?.(props.item)}
            onDoubleClick={() => onDoubleClickEvent?.(props.item)}
            onMouseDown={(e) => {
                activeTool?.listeners?.onMouseDown?.('item', e, props.item);
            }}
            onPointerDown={(e) => {
                activeTool?.listeners?.onPointerDown?.('item', e, props.item)
            }}
            onMouseUp={(e) => {
                activeTool?.listeners?.onMouseUp?.('item', e, props.item);
            }}
            onMouseEnter={(e) => {
                activeTool?.listeners?.onMouseEnter?.('item', e, props.item);
            }}
            onMouseMove={(e) => {
                activeTool?.listeners?.onMouseMove?.('item', e, props.item)
            }}
       
            style={{
                position: 'absolute',
                display: 'flex',
                cursor: 'pointer',
                pointerEvents: 'all',
                left: props.left,
                width: props.width,
                // height: !props.rowHeight ? 0 : undefined,
                minHeight: (props.expanded) ? '100%' : undefined,
                userSelect: 'none'
                // height: '100%',
                // background: '#bbb',
                // borderRadius: ROW_ITEM_RADIUS,
                // border: props.selected ? '1px solid blue' : undefined
            }}>

            {props.item?.resizable != false && <div
                onPointerDown={dragEnd('w')}
                style={{
                    position: 'absolute',
                    left: 0,
                    width: '10px',
                    maxWidth: '100%',
                    height: '100%',
                    cursor: 'w-resize',
                    zIndex: 99
                }}></div>}
            <div style={{ zIndex: 1, flex: 1, display: 'flex', position: 'relative' }}>
                {listeners}
                {props.renderItem?.()}

            </div>

            {props.item?.resizable != false && <div
                onPointerDown={dragEnd('e')}
                style={{
                    position: 'absolute',
                    right: 0,
                    maxWidth: '100%',
                    width: '10px',
                    height: '100%',
                    cursor: 'e-resize',
                    zIndex: 99
                }}></div>}
        </div>
    )
}