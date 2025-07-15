import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import useResizeAware from "react-resize-aware";
import { useSchedule, useTool } from "../context";
import { useDateToScreen, useScreenToDate } from "../utils";

export interface LaneItemProps {
    left?: number,
    top?: number,
    width?: number,
    height?: number,

    lane?: any;

    id: string;
    resizable?: boolean;
    start?: Date;
    end?: Date;

    selected?: boolean;
    onMeasure?: (sizes: { width: number, height: number }, forced?: boolean) => void;

    onMouseDown?: (e: any) => any;
    onMouseUp?: (e: any) => any;
    onMouseEnter?: (e: any) => any;
    onMouseMove?: (e: any) => any;
    onPointerDown?: (e: any) => any;
    onClick?: (e: any) => any;
    onDoubleClick?: (e: any) => any;
}

export const LaneItem: React.FC<LaneItemProps> = memo((props) => {
    const [listeners, sizes] = useResizeAware()

    const [measured, setMeasured] = useState<any>(null);
    
    const screenToDate = useScreenToDate();
    const dateToScreen = useDateToScreen();

    useEffect(() => {
        if (!measured && sizes.width != null && sizes.height != null) {
            props.onMeasure?.(sizes, props.height != undefined)
            setMeasured(sizes)
        } else if (measured && (sizes.width != measured.width || sizes.height != measured.height)) {
            props.onMeasure?.(sizes, props.height != undefined);
            setMeasured(sizes)
        }

    }, [sizes])

    const { activeTool } = useTool();

    const { updateEvent, onClickEvent, onDoubleClickEvent, dragItem } = useSchedule();

    const ref = useRef<HTMLDivElement>(null)

    const onPointerDown = useCallback((e) => {


        // Don't modify the event - let the tool handle pointer capture naturally
        props.onPointerDown(e);

        // Check capture state after tool handler
    }, [props.onPointerDown])


    const dragEnd = (position: string) => {
        return (e: any) => {
            e.stopPropagation();
            let start = e.clientX;
            e.target.setPointerCapture(e.pointerId);

            let move = (e: any) => {
                let diff = e.clientX - start;

                switch (position) {
                    case 'w':
                        updateEvent({id: props.id, start: screenToDate({ x: dateToScreen(props.start).x + diff }) }, true)
                        break;
                    case 'e':
                        updateEvent({id: props.id,  end: screenToDate({ x: dateToScreen(props.end).x + diff }) }, true)
                        break;
                }
            }

            let up = (e: any) => {
                let diff = e.clientX - start;

                switch (position) {
                    case 'w':
                        updateEvent({id: props.id,  start: screenToDate({ x: dateToScreen(props.start).x + diff }) })
                        break;
                    case 'e':
                        updateEvent({id: props.id,  end: screenToDate({ x: dateToScreen(props.end).x + diff }) })
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
            ref={ref}
            style={{
                position: 'absolute',
                left: props.left,
                top: props.top,
                width: props.width,
                height: props.height,
                minHeight: '30px',
                display: 'flex',
                userSelect: 'none'
            }}
            onClick={props.onClick}
            onDoubleClick={props.onDoubleClick}
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
            onMouseEnter={props.onMouseEnter}
            onMouseMove={props.onMouseMove}
            onPointerDown={onPointerDown}
            className={`lane-item ${props.selected ? 'selected' : ''} ${props.lane != undefined ? 'lane-' + props.lane : ''}`}>


            {props?.resizable != false && <div
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
                {props.children}
            </div>


            {props.resizable != false && <div
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
})