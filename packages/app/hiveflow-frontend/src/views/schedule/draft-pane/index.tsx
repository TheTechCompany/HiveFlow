import React from  'react';
import { Box, Typography, Collapse } from '@mui/material'
import { useQuery } from '@hive-flow/api';
import { stringToColor } from "@hexhive/utils"
import { useNavigate } from 'react-router';
export const DraftPane = (props: any) => {

	const navigate = useNavigate();

	const getHours = (item: any) => {
		return (item?.data || []).reduce((prev: any, curr: any) => {
			if(!prev[curr.location]) prev[curr.location] = 0;
			prev[curr.location] += curr.quantity;
			return prev;
		}, {})
	}

	const renderHours = (x: any) => {
		const hours = getHours(x)
		return Object.keys(hours).map((key) => (
			<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
			<Typography variant="body2">{key}</Typography>
			<Typography variant="body2">{hours[key]}hrs</Typography>
			</Box>
		))
	}
	return (
		<Box 	
			sx={{ overflow: 'scroll', display: 'flex', flexDirection: 'column', gap: 1, paddingRight: '3px', width: props.drafts.length > 0 ? props.open ? '200px' : '42px' : '0px' }}>
        {props.drafts.filter((a: any) => a.project).map((x: any) => (
			<Box
				sx={{ minHeight: 'min-content', display: 'flex', justifyContent: 'space-between', borderRadius: '12px', padding: '4px', flexDirection: 'row' }}
			style={{background: stringToColor(`${x.project?.id} - ${props.projects.find((a: any) => a?.id == x.project?.id)?.name}`)}}>
				<Box
					onDoubleClick={() => {
						navigate(`/projects/${x.project?.displayId}`)
					}}
					sx={{ flex: 1, display: 'flex', alignItems: props.open ? 'flex-start' : 'center', flexDirection: 'column' }}
					>
					{props.open && <Typography variant="body2">{props.projects.find((a: any) => a?.id == x.project?.id)?.name}</Typography>}
				
					<Typography variant="body2">{x.project?.displayId}</Typography>
				</Box>
				{props.open && <Box sx={{ display: 'flex', flexDirection: 'column' }}>
					{renderHours(x)}
				</Box>}
			</Box>

          ))}  
		</Box>
	)
}