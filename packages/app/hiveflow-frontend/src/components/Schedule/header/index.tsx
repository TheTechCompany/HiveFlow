import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useResizeAware from "react-resize-aware";
import { useRowHeights, useSchedule } from "../context";
import { ColumnHeader } from "./column-header";
import moment from "moment";

export const Header = (props: any) => {
    const { horizon, step, stepCount } = useSchedule();
    const { updateHeaderHeight } = useRowHeights();
    const [listeners, sizes] = useResizeAware();

    const [ headerHandle, setHeaderHandle ] = useState<any>(null);
    const [ headerHeight, setHeaderHeight ] = useState<any>(null);

    useEffect(() => {
        updateHeaderHeight(sizes.height)
    }, [sizes])

    const getFormat = (unit: string) => {
        switch (unit) {
            case 'month':
                return 'MMMM';
            case 'day':
                return 'DD/MM';
            case 'hour':
                return 'hh'
            case 'week':
                return '[Week] W';
        }
    }

    const renderHeaders = () => {
        let rows = ['month', 'day']

        switch (step) {
            case 'hour':
                rows = ['day', 'hour'];
                break;
            case 'day':
                rows = ['day'];
                break;
            case 'week':
                rows = ['month', 'week', 'day'];
                break;
            case 'month':
                rows = ['month', 'week'];
                break;
            case 'year':
                rows = ['month']
                break;
        }


        let endDate = moment(horizon?.start).clone().add(stepCount, step as any)

        const [ headerData, setHeaderData ] = useState<any>({});

        const renderType = (type: string[], start: Date, end: Date, parent?: any) => {
            if (!type || type.length == 0) return;
            let diff = moment(end).diff(start, type[0] as any)
            let output = [];

            let nextTypes = type.slice();
            nextTypes.splice(0, 1);

            for (var i = 0; i < diff; i++) {
                let outStart = moment(start).clone().add(i, type[0] as any);
                
                const ExternalHeader = props.renderHeader;
                output.push(
                    <>
                        <div style={{
                            flexDirection: 'column',
                            display: 'flex',
                            flex: 1,
                        }}>
                            <div style={{ fontSize: 18 * (1 - ((rows.length - type.length) * 0.2)) + "px", textAlign: 'center' }}>
                                {outStart.format(getFormat(type[0]))}
                            </div>
                            <Divider />
                            {nextTypes.length > 0 &&
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        {renderType(nextTypes, outStart.toDate(), outStart.clone().add(1, type[0] as any).toDate(), nextTypes[0])}
                                    </div>
                                    {/* <Divider /> */}
                                </>
                            }

                            {!parent && ExternalHeader && (
                                <>
                                    <ExternalHeader
                                        start={outStart.toDate()}
                                        end={moment(outStart).endOf(type[0] as any)?.toDate()} 
                                        height={headerHeight}
                                        data={headerData}
                                        setData={setHeaderData} />
                                    {/* {props.renderHeader?.({ 
                                        start: outStart.toDate(),
                                        end: moment(outStart).endOf(type[0] as any)?.toDate(),
                                        height: headerHeight,
                                        data: headerData,
                                        setData: setHeaderData
                                    })} */}
                                    <Box
                                        onMouseEnter={() => {
                                            setHeaderHandle(true)
                                        }}
                                        onMouseLeave={() => {
                                            setHeaderHandle(false)
                                        }}
                                        onMouseDown={(e: any) => {
                                            let startY = e.clientY;

                                            e.currentTarget.setPointerCapture(e.pointerId)

                                            const move = (e: any) => {
                                                let diff = e.clientY - startY;
                                                console.log({ headerHeight, diff })

                                                if (headerHeight + diff > 0) {
                                                    if (headerHeight + diff < 10) {
                                                        setHeaderHeight(0)
                                                    } else {
                                                        setHeaderHeight(headerHeight + diff);
                                                    }
                                                }
                                            }

                                            const up = (e: any) => {
                                                let diff = e.clientY - startY;
                                                if (headerHeight + diff > 0) {
                                                    if (headerHeight + diff < 10) {
                                                        setHeaderHeight(0)
                                                    } else {
                                                        setHeaderHeight(headerHeight + diff);
                                                    }
                                                }

                                                e.currentTarget.releasePointerCapture(e.pointerId)

                                                e.currentTarget.removeEventListener('mousemove', move)
                                                e.currentTarget.removeEventListener('mouseup', up)
                                            }

                                            e.currentTarget.addEventListener('mousemove', move)
                                            e.currentTarget.addEventListener('mouseup', up)

                                        }}
                                        sx={{
                                            background: headerHandle ? 'blue' : 'transparent',
                                            height: '2px',
                                            cursor: 'ns-resize',
                                            width: '100%'
                                        }}></Box>
                                </>
                            )}
                        </div>
                        <Divider orientation="vertical" />
                    </>
                )
            }
            return (<div style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
                {output}
            </div>);
        }
        return renderType(rows, horizon?.start, endDate.toDate())
    }


    // const columns = useMemo(() => {

    //     let items = [];
    //     for (var i = 0; i < props.stepCount; i++) {
    //         let column = {index: i, headerContent: (<div>Graph<Divider /></div>)}
    //         items.push(column)
    //     }
    //     return items;
    // }, [props.stepCount])

    return <Box
        className="timeline-header"
        sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between'
        }}>
        {listeners}
        {renderHeaders()}
        {/* {props.columns?.map((col) => <ColumnHeader format={props.format} column={col} />)} */}
    </Box>
}