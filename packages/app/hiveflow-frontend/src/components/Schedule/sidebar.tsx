import { Box, Button, Divider, Typography } from "@mui/material"
import { useRowHeights } from "./context";

export interface SidebarProps {
    rows?: any[];
    setHoverRow?: (row: any) => void;

    onExpand?: (item: any) => void;
}

export const Sidebar : React.FC<SidebarProps> = (props) => {
    const { rowHeights, headerHeight } = useRowHeights();

    return (
        <Box>
            <Button 
                fullWidth
                style={{ height: headerHeight + 'px', textTransform: 'none', textAlign: 'center' }}>
                3 unscheduled
            </Button>
            <Divider />
            {props.rows?.map((x, i) => (
                <div
                    onMouseDown={() => props.onExpand(i)}
                    onMouseEnter={() => props.setHoverRow?.(x)}
                    onMouseLeave={() => props.setHoverRow?.(null)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: rowHeights?.[i],
                        borderBottom: '1px solid black',
                    }}>
                    <Typography sx={{ padding: '8px' }}>
                        {x.name}
                    </Typography>
                </div>
            ))}
        </Box>
    )
}