import { Box } from "@mui/material";
import { useEffect } from "react";
import useResizeAware from "react-resize-aware";
import { useRowHeights } from "../context";
import { ColumnHeader } from "./column-header";

export const Header = (props: any) => {
    const { updateHeaderHeight } = useRowHeights();
    const [ listeners, sizes ] = useResizeAware();

    useEffect(() => {
        updateHeaderHeight(sizes.height)
    }, [sizes])

    return <Box 
    className="timeline-header"
    sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between'
    }}>
        {listeners}
        {props.columns?.map((col) => <ColumnHeader format={props.format} column={col} />)}
    </Box>
}