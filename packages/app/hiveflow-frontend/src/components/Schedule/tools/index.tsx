import { Box } from "@mui/material"
import React, { useState } from "react";
import { useSchedule } from "../context";
import { DEFAULT_TOOLS } from "./defaults";

export interface ToolsProps {
}

export const Tools: React.FC<ToolsProps> = (props) => {

    const { tool, changeTool, timelinePosition } = useSchedule();
    const [ hoverPos, setHoverPos ] = useState<any>(null);

    
    return (
        <Box>
            {DEFAULT_TOOLS.map((tool_item) => (
                <Box
                    onClick={() => changeTool(tool_item)}
                    sx={{
                        background: tool?.name == tool_item.name ? '#dfdfdf' : undefined,
                        cursor: 'pointer',
                        padding: '8px'
                    }}>
                    {tool_item.icon}
                </Box>
            ))}
        </Box>
    )
}