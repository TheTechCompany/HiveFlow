import { Autocomplete, IconButton, Paper, Slider, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { Sidebar } from "./sidebar";
import { Tools } from "./tools";
import { Timeline } from "./timeline";
import { RowHeightProivder, ScheduleProvider, ToolProvider } from "./context";
import useResizeAware from "react-resize-aware";
import { DEFAULT_TOOLS } from "./tools/defaults";
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import moment from "moment";

export interface ScheduleProps {
    horizon: Date;
    onHorizonChanged?: (start: Date, end: Date) => void;


    renderItem?: (item: any) => any;
    getRowGroup?: (event: any) => any

    events?: {
        project: any;
        start: Date
    }[]

    createEvent?: (event: any) => void;
    updateEvent?: (event: any) => void;

    expanded?: string[];

    onSelectMenuItem?: (item: any) => void;
    
    onClickEvent?: (event: any) => void;
    onDoubleClickEvent?: (event: any) => void;
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

    const [ selected, setSelected ] = useState<any[]>([])

    useEffect(() => {
        setEvents(props.events)
    }, [JSON.stringify(props.events)])

    const rows = useMemo(() => {
        const groupedEvents = events?.map(x => ({ ...x, group: props.getRowGroup?.(x), }));

        const groups = [...new Set(groupedEvents.map((x) => x.group))]

        return groups.map((g, ix) => {
            return {
                id: groupedEvents?.[0]?.groupBy?.id,
                name: g,
                events: groupedEvents?.filter((a) => a.group == g)
            }
        })
    }, [events])

    const changeHorizon = (dir: number) => {
        return () => {
            let start = moment(props.horizon).add(stepCount * dir, step as any).toDate()
            let end = moment(props.horizon).add(stepCount * dir * 2, step as any).toDate()
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


    return (
        <ScheduleProvider value={{
            timelineSize: sizes,
            timelinePosition: controlRef.current?.getBoundingClientRect?.(),
            horizon: props.horizon,
            tool,
            // activeTool,
            selected,
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
                        console.log(newEvents)

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
                                <Autocomplete
                                    sx={{ minWidth: '200px' }}
                                    renderInput={(params) => <TextField {...params} label="View" size="small" />}
                                    options={[]} />
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1, padding: '8px', justifyContent: 'center' }}>
                                <IconButton 
                                    onClick={changeHorizon(-1)}
                                    size="small">
                                    <ChevronLeft fontSize="inherit" />
                                </IconButton>
                                <Typography>
                                    {moment(props.horizon).format('DD/MM/yyyy')} - {moment(props.horizon).add(stepCount, step as any).format('DD/MM/yyyy')}
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
                                flexDirection: 'column',
                                gap: '8px',
                                padding: '8px',
                                justifyContent: 'center',
                                alignItems: 'flex-end'
                            }}>

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
                                    sx={{ width: '50%' }}
                                    size="small"
                                    min={1}
                                    max={3 * 28}
                                />

                            </div>
                        </Paper>
                        <div style={{
                            display: 'flex',
                            minHeight: 0,
                            flex: 1
                        }}>
                            <Paper sx={{
                                minWidth: '200px',
                                display: 'flex'
                            }}>
                                <Sidebar 
                                    onExpand={props.onSelectMenuItem}
                                    
                                    rows={timelineRows} />
                            </Paper>
                            <div style={{ 
                                overflow: 'auto',
                                
                                position: 'relative', display: 'flex', flex: 1 }} ref={controlRef}>
                                {resizeListener}
                                <Timeline
                                    renderItem={props.renderItem}
                                    expanded={props.expanded}
                                    horizon={props.horizon}
                                    step={step}
                                    stepCount={stepCount}
                                    rows={rows} />
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