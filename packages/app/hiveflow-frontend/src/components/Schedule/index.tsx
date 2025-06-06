import { Autocomplete, Button, Checkbox, IconButton, Menu, MenuItem, Paper, Slider, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { Sidebar } from "./sidebar";
import { Tools } from "./tools";
import { Timeline } from "./timeline";
import { RowHeightProivder, ScheduleProvider, ToolProvider } from "./context";
import useResizeAware from "react-resize-aware";
import { DEFAULT_TOOLS } from "./tools/defaults";
import { ChevronLeft, ChevronRight, Filter, FilterList } from '@mui/icons-material'
import moment from "moment";


export interface Horizon {
    start: Date;
    end: Date;
}

export interface ScheduleProps {
    horizon: Horizon;
    onHorizonChanged?: (horizon: Horizon) => void;

    sidebarHeader?: any;

    renderItem?: (item: any) => any;
    renderHeader?: (header: any) => any;

    getRowGroup?: (event: any) => any

    events?: {
        groupBy: {id: string};
        start: Date;
        end: Date;

        data?: any;
        
        resizable?: boolean;
        selectable?: boolean;
    }[]

    createEvent?: (event: any, autocreate?: boolean) => void;
    updateEvent?: (event: any) => void;

    expanded?: string[]; //Rows to be expanded

    onSelectMenuItem?: (item: any) => void;
    
    onClickEvent?: (event: any) => void;
    onDoubleClickEvent?: (event: any) => void;

    onCopy?: (items: any[]) => void;
    onDelete?: (items: any[]) => void;
    // get
}

export const Schedule: React.FC<ScheduleProps> = (props) => {

    const [resizeListener, sizes] = useResizeAware();
    const controlRef = useRef(null);

    const [tool, changeTool] = useState(DEFAULT_TOOLS[0]);

    const step = useMemo(() => {
        let start = moment(props.horizon.start)
        let end = moment(props.horizon.end)

        if(end.diff(start, 'days') < 2){
            return 'hour';
        }else if(end.diff(start, 'week') < 2){
            return 'day';
            
        }else if(end.diff(start, 'months') < 6){
            return 'month';
        }else{
            return 'year';
        }
    }, [props.horizon])


    const stepCount = useMemo(() => {
        let start = moment(props.horizon.start)
        let end = moment(props.horizon.end)
        return Math.round(end.diff(start, step, true));
    }, [step, props.horizon])

    console.log({step, stepCount})


    // const [step, setStep] = useState('day');
    // const [stepCount, setStepCount] = useState(7)

    const [events, setEvents] = useState<any[]>([]);

    const [ _selected, setSelected ] = useState<any[]>([])
    const selected = _selected.filter((a) => events.findIndex((b) => b.id == a) > -1)

    useEffect(() => {
        setEvents(props.events)
    }, [JSON.stringify(props.events)])

    const rows = useMemo(() => {
        const groupedEvents = events?.map(x => ({ ...x, group: props.getRowGroup?.(x), }));

        const groups = [...new Set(groupedEvents.map((x) => x.group))]

        return groups.map((g, ix) => {
            return {
                id: groupedEvents?.filter((a) => a.group == g)?.[0]?.groupBy?.id,
                name: g,
                events: groupedEvents?.filter((a) => a.group == g)
            }
        })
    }, [events])

    const timelineRows = useMemo(() => {
        // (sizes?.height / 30) + 
        let count = rows.length + 5;
        let outputRows = [];

        for (var i = 0; i < count; i++) {
            outputRows.push({
                ...rows?.[i],
                index: i
            })
        }

        return outputRows;
    }, [rows, sizes]);


    const [ copyItems, setCopyItems ] = useState<any[]>([]);
    const [ pasteItems, setPasteItems ] = useState<any[]>([]);


    return (
        <ScheduleProvider value={{
            copyItems,
            pasteItems,
            setPasteItems,

            timelineSize: sizes,
            timelinePosition: controlRef.current?.getBoundingClientRect?.(),
            events: events,
            horizon: props.horizon,
            tool,
            // activeTool,
            renderItem: props.renderItem,
            selected,
            expanded: props.expanded,
            changeSelection: setSelected,
            changeTool,
            step,
            stepCount,
            onClickEvent: props.onClickEvent,
            onDoubleClickEvent: props.onDoubleClickEvent,
            createEvent: props.createEvent,
            updateEvent: (event: any, uiUpdate: boolean = false) => {
                if (!uiUpdate) props.updateEvent(event);
                if (uiUpdate) {
                    setEvents((evnts) => {
                        let newEvents = evnts.slice();
                        let ix = newEvents.findIndex((a) => a.id == event.id)
                        newEvents[ix] = {
                            ...newEvents[ix],
                            ...event
                        }

                        return newEvents
                    })

                }
            }
        }}>
            <RowHeightProivder>
                <ToolProvider key={JSON.stringify(tool)} tool={tool}>
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        gap: '8px',
                        flexDirection: 'column'
                    }}>
                        
                        <div style={{
                            display: 'flex',
                            minHeight: 0,
                            flex: 1,
                            gap: '8px'

                        }}>
                            <Paper sx={{
                                minWidth: '200px',
                                display: 'flex',
                            }}>
                                <Sidebar 
                                    header={props.sidebarHeader}
                                    onExpand={props.onSelectMenuItem}
                                    
                                    rows={timelineRows} />
                            </Paper>
                            <div style={{ 
                                overflow: 'auto',
                                
                                position: 'relative', display: 'flex', flex: 1 }} ref={controlRef}>
                                {resizeListener}
                                <Timeline
                                    renderItem={props.renderItem}
                                    renderHeader={props.renderHeader}
                                    expanded={props.expanded}
                                    horizon={props.horizon}
                                    step={step}
                                    stepCount={stepCount}
                                    rows={rows}
                                    onDeleteItem={() => {
                                        props.onDelete?.(selected)
                                    }} 
                                    onCopyItem={() => {
                                        props.onCopy?.(selected);
                                        setCopyItems(selected)
                                    }}
                                    onPasteItem={() => {
                                        // props.onPaste?.();
                                        changeTool(DEFAULT_TOOLS.find((a) => a.name == 'select'))
                                        setPasteItems(copyItems.map((x) => events.find((a) => a.id ==x)))
                                    }}/>
                            </div>
                            <Paper>
                                <Tools />
                            </Paper>
                        </div>
                    </div>
                </ToolProvider>
            </RowHeightProivder>
        </ScheduleProvider>
    )
}