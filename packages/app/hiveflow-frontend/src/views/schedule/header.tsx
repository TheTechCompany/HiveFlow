import { Autocomplete, Button, Checkbox, IconButton, Menu, MenuItem, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react"
import { FilterList, ChevronLeft, ChevronRight } from '@mui/icons-material'
import moment from "moment";
import { Horizon } from "../../components/Schedule";

export interface HeaderProps {
    horizon: Horizon;
    onHorizonChanged?: (horizon: Horizon) => void;

    graphType?: string;
    setGraphType?: any;
}

export const Header : React.FC<HeaderProps> = (props) => {
    const [step, setStep] = useState('day');
    const [stepCount, setStepCount] = useState(7)


    const [ filterAnchor, setFilterAnchor ] = useState<any>(null);
    

    const changeHorizon = (dir: number) => {

        return () => {
            let newStart = moment(props.horizon.start).add(stepCount * dir, step as any).toDate()
            let newEnd = moment(props.horizon.start).add((stepCount * dir) + stepCount, step as any).toDate()
            
            props.onHorizonChanged?.({start: newStart, end: newEnd})
        }
    }
    return (
        <Paper style={{ display: 'flex', minHeight: '50px', paddingLeft: '8px', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={(e) => {
                    setFilterAnchor(e.currentTarget)
                }}>
                    <FilterList />
                </IconButton>
                <Typography>Filter</Typography>
                <Menu
                    onClose={() => setFilterAnchor(null)}
                    open={filterAnchor != null}
                    anchorEl={filterAnchor}>

                    <MenuItem sx={{ paddingRight: '8px' }} disableGutters dense>
                        <Checkbox checked={true} />
                        <Typography>Show people on leave</Typography>
                    </MenuItem>
                    <MenuItem>
                        <Autocomplete
                            value={props.graphType}
                            onChange={(e, newGraphType) => {
                                props.setGraphType(newGraphType)
                            }}
                            fullWidth
                            options={[
                                "Capacity",
                                "Unassigned"
                            ]}
                            renderInput={(params) => <TextField {...params} size="small" label="Graph type" />} />
                    </MenuItem>
                </Menu>

            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1, padding: '8px', justifyContent: 'center' }}>
                <IconButton
                    onClick={changeHorizon(-1)}
                    size="small">
                    <ChevronLeft fontSize="inherit" />
                </IconButton>
                <Typography>
                    {moment(props.horizon.start).format('DD/MM/yyyy')} - {moment(props.horizon.end).subtract(1, 'seconds').format('DD/MM/yyyy')}
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
                    let start = moment().startOf('day');
                    let end = moment().endOf('day');
                    props.onHorizonChanged?.({start: start.toDate(), end: end.toDate()})
                }}>Day</Button>
                <Button
                    variant={step == 'day' ? 'contained' : "outlined"}
                    onClick={() => {
                        setStep('day')
                        setStepCount(7);

                        let start = moment().startOf('isoWeek');
                        let end = moment().endOf('isoWeek');
                        props.onHorizonChanged?.({start: start.toDate(), end: end.toDate()})

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

                        let start = moment().startOf('quarter');
                        let end = moment().endOf('quarter');
                        props.onHorizonChanged?.({start: start.toDate(), end: end.toDate()})
                        
                    }}>

                    Quarter
                </Button>
                <Button
                    variant={step == 'year' ? 'contained' : "outlined"}
                    onClick={() => {
                        setStep('year');
                        setStepCount(1)

                        let start = moment().startOf('year');
                        let end = moment().endOf('year');
                        props.onHorizonChanged?.({start: start.toDate(), end: end.toDate()})

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
    )
}