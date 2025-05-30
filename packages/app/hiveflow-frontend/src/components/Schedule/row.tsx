import { Box } from "@mui/material";
import { useDateToScreen, useScreenToDate } from "./utils";
import { useRowHeights, useSchedule, useTool } from "./context";
import useResizeAware from "react-resize-aware";
import { useEffect } from "react";

export const ROW_ITEM_CONTAINER = '30px';
export const ROW_ITEM_HEIGHT = '80%';
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
    const { updateRowHeight } = useRowHeights();
    const { selected } = useSchedule();

    const [ resizeListeners, sizes ] = useResizeAware();

    useEffect(() => {
        updateRowHeight(rowTemplate?.id, sizes.height)
    }, [rowTemplate, sizes])

    return (
        <Box

            sx={{
                position: 'relative',
                borderBottom: filled ? '1px solid black' : '1px solid #dfdfdf',
                display: 'flex',
                alignItems: 'center',
                height: expanded ? '100px' : ROW_ITEM_CONTAINER,
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
            onMouseUp={(e) => {
                activeTool?.listeners?.onMouseUp?.('row', e, rowTemplate);
            }}
            >
            {resizeListeners}

            {activeTool?.component?.(rowTemplate)}

            {events.map((event) => {

                const { x } = dateToScreen(event.start);
                const { x: endX } = dateToScreen(event.end);

                const width = endX - x;
                return <PlanItem
                    left={x}
                    width={width}
                    selected={selected.indexOf(event.id) > -1}
                    item={event}
                    renderItem={() => renderItem(event)} />
            })}


        </Box>
    )
}


export const PlanItem = (props: any) => {

    const screenToDate = useScreenToDate();
    const dateToScreen = useDateToScreen();

    const { updateEvent } = useSchedule();
    const { activeTool } = useTool();

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
                e.target.removeEventListener('mousemove', move);
                e.target.removeEventListener('mouseup', up);
                e.target.releasePointerCapture(e.pointerId);
            }

            e.target.addEventListener('mousemove', move);
            e.target.addEventListener('mouseup', up);

        }
    }

    return (
        <div
            onMouseDown={(e) => {
                activeTool?.listeners?.onMouseDown?.('item', e, props.item);
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
                height: ROW_ITEM_HEIGHT,
                // background: '#bbb',
                // borderRadius: ROW_ITEM_RADIUS,
                // border: props.selected ? '1px solid blue' : undefined
            }}>
            <div
                onMouseDown={dragEnd('w')}
                style={{
                    position: 'absolute',
                    left: 0,
                    width: '10px',
                    maxWidth: '100%',
                    height: '100%',
                    cursor: 'w-resize'
                }}></div>
            
            {props.renderItem?.()}

            <div
                onMouseDown={dragEnd('e')}
                style={{
                    position: 'absolute',
                    right: 0,
                    maxWidth: '100%',
                    width: '10px',
                    height: '100%',
                    cursor: 'e-resize'
                }}></div>
        </div>
    )
}