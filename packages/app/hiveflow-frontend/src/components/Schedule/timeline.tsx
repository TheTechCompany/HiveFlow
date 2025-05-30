import { Box, Button, Divider, IconButton, Paper, Typography } from "@mui/material";
import moment from "moment";
import { useMemo, useRef, useState } from "react";
import { Row } from "./row";
import { RowHeightProivder, useRowHeights, useSchedule, useTool } from "./context";
import { Header } from "./header";

export interface TimelineProps {

    horizon: Date;

    // rows?: { project: any }[]
    rows?: { id: any, name: string, headerContent?: any, events: any[] }[];

    expanded?: string[];

    step: string;
    stepCount: number;

    renderItem?: (event: any) => any;
}

export const Timeline: React.FC<TimelineProps> = (props) => {

    const { timelineSize } = useSchedule();

    const { activeTool } = useTool();

    const { headerHeight } = useRowHeights();

    const baseFormat = useMemo(() => {
        let baseFormat = 'DD/MM/yyyy';

        if (props.step == 'hour') {
            baseFormat = 'hh:mm'
        }
        return baseFormat
    }, [props.step]);
    
    const columns = useMemo(() => {

        let items = [];
        for (var i = 0; i < props.stepCount; i++) {
            let column = {index: i, headerContent: (<div>Graph<Divider /></div>)}
            items.push(column)
        }
        return items;
    }, [props.stepCount])

    const columnDividers = useMemo(() => {
  
        let items = [];
        for (var i = 0; i < props.stepCount; i++) {

            items.push(<>
                <div style={{flex: 1}}></div>
                <Divider orientation="vertical" />
            </>)
        }
        return items;
    }, [props.horizon, props.step, props.stepCount])

    const rows = useMemo(() => {
        let count = timelineSize?.height / 40;
        let outputRows = [];

        for (var i = 0; i < count; i++) {
            outputRows.push(
                <Row
                    filled={props.rows[i] != undefined}
                    expanded={props.expanded?.indexOf(i as any) > -1}
                    row={{...props.rows?.[i], id: i, index: i}}
                    events={props.rows[i]?.events || []} 
                    renderItem={props.renderItem}/>
            )
        }
        return outputRows;
    }, [timelineSize, props.renderItem, props.rows, props.expanded])

    return (
        <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                <Paper style={{
                    flex: 1,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <Header 
                        format={baseFormat}
                        columns={columns} />
                    <Box sx={{
                        pointerEvents: 'none',
                        display: 'flex',
                        flex: 1,
                        justifyContent: 'space-between'
                    }}>
                        {columnDividers}

                    </Box>
              
                    <Box
                        sx={{
                            position: 'absolute',
                            paddingTop: headerHeight + 'px',
                            width: '100%',
                            height: '100%'
                        }}>
                        {rows}
                    </Box>
                </Paper>
        </div>
    )
}



// {rows?.map((row, i) => {

//     const rowTemplate = {
//         ...props.rows?.[i],
//         index: i
//     }
//     return <Box
//         onMouseEnter={(e) => {
//             activeTool?.listeners?.onMouseEnter?.('row', e, rowTemplate)
//         }}
//         onMouseMove={(e) => {
//             activeTool?.listeners?.onMouseMove?.('row', e, rowTemplate);
//         }}
//         onMouseLeave={(e) => {
//             activeTool?.listeners?.onMouseLeave?.('row', e, rowTemplate);
//         }}
//         onMouseDown={(e) => {
//             console.log({ row })
//             activeTool?.listeners?.onMouseDown?.('row', e, rowTemplate);
//         }}
//         onMouseUp={(e) => {
//             activeTool?.listeners?.onMouseUp?.('row', e, rowTemplate);
//         }}
//         sx={{
//             position: 'relative',
//             // borderBottom: '1px solid black',
//             display: 'flex',
//             alignItems: 'center',
//             height: '40px',
//             width: '100%'
//         }}>

//         {activeTool?.component?.(rowTemplate)}
//         {/* <RowComponent {...row} /> */}

//     </Box>
// })}