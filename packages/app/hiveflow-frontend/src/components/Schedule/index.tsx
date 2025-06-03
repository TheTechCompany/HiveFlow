import { Autocomplete, Button, IconButton, Paper, Slider, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { Sidebar } from "./sidebar";
import { Tools } from "./tools";
import { Timeline } from "./timeline";
import { RowHeightProivder, ScheduleProvider, ToolProvider } from "./context";
import useResizeAware from "react-resize-aware";
import { DEFAULT_TOOLS } from "./tools/defaults";
import { ChevronLeft, ChevronRight, Filter, FilterList } from '@mui/icons-material'
import moment from "moment";

export interface ScheduleProps {
    horizon: Date;
    onHorizonChanged?: (start: Date, end: Date) => void;


    sidebarHeader?: any;

    renderItem?: (item: any) => any;
    renderHeader?: (header: any) => any;

    getRowGroup?: (event: any) => any

    events?: {
        project: any;
        start: Date
    }[]

    createEvent?: (event: any, autocreate?: boolean) => void;
    updateEvent?: (event: any) => void;

    expanded?: string[];

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

    const [horizonSize, setHorizonSize] = useState(7);

    const [step, setStep] = useState('day');
    const [stepCount, setStepCount] = useState(7)

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

    const changeHorizon = (dir: number) => {
        return () => {
            let start = moment(props.horizon).add(stepCount * dir, step as any).toDate()
            let end = moment(props.horizon).add((stepCount * dir) + stepCount, step as any).toDate()
            props.onHorizonChanged(start, end)
        }
    }

    const timelineRows = useMemo(() => {
        let count = (sizes?.height / 30) + rows.length;
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
                        <Paper style={{ display: 'flex', paddingLeft: '8px', justifyContent: 'space-between' }}>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                <IconButton>
                                    <FilterList />
                                </IconButton>
                                <Typography>Filter</Typography>
                                {/* <Autocomplete
                                    sx={{ minWidth: '200px' }}
                                    renderInput={(params) => <TextField {...params} label="View" size="small" />}
                                    options={[]} /> */}
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1, padding: '8px', justifyContent: 'center' }}>
                                <IconButton 
                                    onClick={changeHorizon(-1)}
                                    size="small">
                                    <ChevronLeft fontSize="inherit" />
                                </IconButton>
                                <Typography>
                                    {moment(props.horizon).format('DD/MM/yyyy')} - {moment(props.horizon).add(stepCount - 1, step as any).endOf(step as any).format('DD/MM/yyyy')}
                                </Typography>
                                <IconButton 
                                    onClick={changeHorizon(1)}
                                    size="small">
                                    <ChevronRight fontSize="inherit" />
                                </IconButton>
                            </div>
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                // flexDirection: 'column',
                                gap: '8px',
                                padding: '8px',
                                alignItems: 'center',
                                justifyContent: 'flex-end'
                                // alignItems: 'flex-end'
                            }}>

                                <Button variant={step == 'hour' ? 'contained' : "outlined"} onClick={() => {
                                    setStep('hour')
                                    setStepCount(24);
                                    let start = moment(props.horizon).startOf('day');
                                    let end = moment(props.horizon).endOf('day');
                                    props.onHorizonChanged?.(start.toDate(), end.toDate())
                                }}>Day</Button>
                                <Button
                                variant={step == 'day' ? 'contained' : "outlined"}
                                     onClick={() => {
                                        setStep('day')
                                        setStepCount(7);

                                    let start = moment(props.horizon).startOf('week');
                                    let end = moment(props.horizon).endOf('week');
                                    props.onHorizonChanged?.(start.toDate(), end.toDate())

                                    }}
                                    >Week</Button>
                                {/* <Button 
                                variant={step == 'week' ? 'contained' : "outlined"}
                                onClick={() => {
                                    setStep('week')
                                    setStepCount(4);


                                    let start = moment(props.horizon).startOf('M');
                                    let end = moment(props.horizon).add(1, 'month').startOf('M');

                                    console.log("MONTHLY SET", start, end)
                                    props.onHorizonChanged?.(start.toDate(), end.toDate())

                                }}>Month</Button> */}

                                <Button
                                variant={step == 'month' && stepCount == 3 ? 'contained' : "outlined"}
                                     onClick={() => {
                                    setStep('month');
                                    setStepCount(3);

                                    let start = moment(props.horizon).startOf('quarter');
                                    let end = moment(props.horizon).endOf('quarter');
                                    props.onHorizonChanged?.(start.toDate(), end.toDate())
                                }}>
                                    
                                    Quarter
                                </Button>
                                <Button 
                                variant={step == 'year' ? 'contained' : "outlined"}
                                onClick={() => {
                                    setStep('year');
                                    setStepCount(1)

                                    let start = moment(props.horizon).startOf('year');
                                    let end = moment(props.horizon).endOf('year');
                                    props.onHorizonChanged?.(start.toDate(), end.toDate())
                                }}>Year</Button>
{/* 
                                <Slider
                                    value={horizonSize}
                                    onChange={(e, value) => {
                                        let horizonSize = value as any;
                                        setHorizonSize(value as any);
                                        if (horizonSize < 2) {
                                            setStep('hour')
                                            setStepCount(24 * horizonSize)
                                        } else if (horizonSize > 2 && horizonSize < 14) {
                                            setStep('day')
                                            setStepCount(horizonSize)
                                        } else if (horizonSize >= 14 && horizonSize < (28 * 1.5)) {
                                            setStep('week');
                                            setStepCount(Math.floor(horizonSize / 7));
                                        } else if (horizonSize >= (28 * 1.5)) {
                                            setStep('month')
                                            setStepCount(Math.floor(horizonSize / 28));
                                        }

                                        setTimeout(() => {
                                            let start = moment(props.horizon).toDate()
                                            let end = moment(props.horizon).add(stepCount, step as any).toDate()
                                            props.onHorizonChanged(start, end)
                                        }, 0)
                                        // setStep()
                                    }}
                                    sx={{ width: '200px' }}
                                    size="small"
                                    min={1}
                                    max={3 * 28}
                                /> */}

                            </div>
                        </Paper>
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