import { Box, Button, Divider, Typography } from "@mui/material"
import { useRowHeights } from "./context";
import { useEffect, useRef } from "react";
import { ROW_ITEM_CONTAINER } from "./row";

export interface SidebarProps {
    rows?: any[];
    setHoverRow?: (row: any) => void;

    onExpand?: (item: any) => void;
}

export const Sidebar : React.FC<SidebarProps> = (props) => {
    const { rowHeights, headerHeight, scrollTop } = useRowHeights();

    const menuRef = useRef(null);

    useEffect(() => {
        console.log({menu: menuRef.current, scrollTop, top: menuRef.current.scrollTop})
        menuRef.current.scrollTo(0, scrollTop);// = scrollTop ;

    }, [scrollTop])
    return (
        <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{
                height: headerHeight + 'px', 
            }}>
                <Button 
                    fullWidth
                    style={{ textTransform: 'none', height: '100%', textAlign: 'center' }}>
                    3 unscheduled
                </Button>
                <Divider />
            </Box>
            <Box ref={menuRef} sx={{
                overflow: 'hidden',
                flex: 1,
                minHeight: 0
            }}>
                {props.rows?.map((x, i) => (
                    <div
                        onMouseDown={() => props.onExpand?.(i)}
                        onMouseEnter={() => props.setHoverRow?.(x)}
                        onMouseLeave={() => props.setHoverRow?.(null)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            height: rowHeights?.[x?.id] || ROW_ITEM_CONTAINER,
                            borderBottom: x.name ? '1px solid black' : '1px solid #dfdfdf',
                        }}>
                        <Typography sx={{ padding: '8px' }}>
                            {x.name}
                        </Typography>
                    </div>
                ))}
            </Box>
        </Box>
    )
}