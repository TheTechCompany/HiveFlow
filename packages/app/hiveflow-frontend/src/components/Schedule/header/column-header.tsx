import { Divider } from "@mui/material"
import moment from "moment"
import React, { useEffect } from "react"
import { useRowHeights, useSchedule } from "../context"
import useResizeAware from "react-resize-aware"

export interface ColumnProps {
    column?: {index: number, headerContent: any}

    format: string;
}

export const ColumnHeader : React.FC<ColumnProps> = (props) => {

    const { horizon, step } = useSchedule();


    return <><div style={{
        flex: 1,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',

    }}>
        <div>
            <div style={{ height: '27px', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '4px', paddingBottom: '4px', fontSize: 10 }}>
                {moment(horizon?.start).add(props.column.index, step as any).format(props.format)}
            </div>
            <Divider />
            {props.column?.headerContent}
        </div>
    </div>
    <Divider orientation="vertical" />
    </>
}