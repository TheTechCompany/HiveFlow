import { Box, Divider, Typography } from "@mui/material";
import { useEffect } from "react";
import useResizeAware from "react-resize-aware";
import { useRowHeights, useSchedule } from "../context";
import { ColumnHeader } from "./column-header";
import moment from "moment";

export const Header = (props: any) => {
    const { horizon, step, stepCount } = useSchedule();
    const { updateHeaderHeight } = useRowHeights();
    const [ listeners, sizes ] = useResizeAware();

    useEffect(() => {
        updateHeaderHeight(sizes.height)
    }, [sizes])

    const getFormat = (unit: string) => {
        switch(unit){
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

        switch(step){
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

        
        let endDate = moment(horizon).clone().add(stepCount, step as any)

        const renderType = (type: string[], start: Date, end: Date, parent?: any) => {
            if(!type || type.length == 0) return;
            let diff = moment(end).diff(start, type[0] as any)
            let output = [];

            let nextTypes = type.slice();
            nextTypes.splice(0, 1);

            for(var i = 0; i < diff; i++){
                let outStart = moment(start).clone().add(i, type[0] as any);
                output.push(
                    <>
                    <div style={{
                        flexDirection: 'column',
                        display: 'flex',
                        flex: 1,
                    }}>
                        <div style={{ fontSize: 18 * (1 - ((rows.length - type.length)*0.2)) + "px",  textAlign:'center'}}>
                            {outStart.format(getFormat(type[0]))}
                        </div>
                        <Divider />
                        {nextTypes.length > 0 && 
                            <>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                {renderType(nextTypes, outStart.toDate(), outStart.clone().add(1, type[0] as any).toDate(), nextTypes[0])}
                            </div>
                            {/* <Divider /> */}
                            </>
                        }
                        
                        {!parent && props.renderHeader?.({start: outStart.toDate(), end: moment(outStart).endOf(type[0] as any)?.toDate()})}
                    </div>
                    <Divider orientation="vertical" />
                    </>
                )
            }
            return (<div style={{display: 'flex', flex: 1, justifyContent: 'space-between'}}>
                {output}
            </div>);
        }
        return renderType(rows, horizon, endDate.toDate())
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