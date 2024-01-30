import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableSortLabel, IconButton, Box, List, ListItem, ListItemButton, Typography } from '@mui/material';
import React from 'react';
import { MoreVert } from '@mui/icons-material'

export interface DataTableColumn {
    property: string;
    header?: string;
    size?: any;
    width?: string;
    sortable?: boolean;
    align?: string;
    render?: any;
}

export interface DataTableProps {
    data?: any[];
    columns?: DataTableColumn[]

    order: 'asc' | 'desc',
    orderBy?: string;
    onSort?: (property: string) => void;
    onClickRow?: (item: any) => void;
    onEditRow?: (item: any) => void;
}

export const DataTable: React.FC<DataTableProps> = (props) => {

    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
        props.onSort?.(property)
    }

    const getSize = (col: string) => {
        switch (col) {
            case 'xsmall': return '10%';
            case 'small': return '20%';
            case 'medium': return '30%';
            case 'large': return '60%';
        }
    }

    return (
        <Box sx={{ flex: 1, flexDirection: 'column', display: 'flex' }}>
            <Box sx={{ display: 'flex', bgcolor: 'secondary.main', paddingRight: props.onEditRow ? '48px' : null }}>
                {props.columns?.map((column) => (
                    <Box
                        sx={{
                            display: 'flex',
                            width: column.size ? getSize(column.size) : column.width,
                            justifyContent: column.align == "center" ? "center" : "flex-start",
                            color: 'white',
                            padding: '8px !important'
                        }}
                    // sortDirection={props.orderBy === column.property ? props.order : false}
                    >
                        {column.sortable &&
                            <TableSortLabel
                                sx={{ '& svg': { color: 'white !important' } }}
                                active={props.orderBy === column.property}
                                direction={props.orderBy === column.property ? props.order : 'asc'}
                                onClick={createSortHandler(column.property)} />}
                        <Typography>{column.header || column.property}</Typography>
                    </Box>
                ))}
             
            </Box>
            <Box sx={{overflowY: 'auto', flex: 1}}>
                <List>
                    {props.data?.map((data) => (
                        <ListItem
                            disablePadding
                            secondaryAction={props.onEditRow ? (

                                <IconButton
                                    sx={{ zIndex: 12 }}
                                    onClick={() => props.onEditRow?.(data)}>
                                    <MoreVert />
                                </IconButton>
                            ) : null}
                            sx={{ 
                                cursor: props.onClickRow ? 'pointer' : 'initial',
                                borderBottom: '1px solid rgb(224, 224, 224)',
                                fontSize: '0.875rem'
                            }}
                            // hover={Boolean(props.onClickRow)}
                           >
                            <ListItemButton 
                             onClick={() => props.onClickRow?.(data)}
                            sx={{
                                padding: 0, 
                                minHeight: '42px'
                            }}>
                                {props.columns?.map((column, ix) => (
                                    <Box
                                        padding="none"
                                        sx={{
                                            padding: '8px',
                                            // paddingLeft:  ix ==0 &&'32px',
                                            // height: '42px',
                                            // paddingLeft: '8px',
                                            // paddingRight: '8px',
                                            display: 'flex',
                                            height: '100%',
                                            width: column.size ? getSize(column.size) : column.width,
                                            justifyContent: column.align == "center" ? "center" : "flex-start",
                                        }}>
                                            <Box sx={{marginLeft: '25px'}}>
                                            {column.render ? column.render?.(data || {}) : data?.[column.property]}

                                            </Box>
                                    </Box>
                                ))}
                            </ListItemButton>




                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>

    )


}


/*
 <TableContainer sx={{flex: 1}}>
            <Table>
                <TableHead >
                    <TableRow >
                        {props.columns?.map((column) => (
                            <TableCell 
                                size={column.size}
                                align={column.align == "center" ? "center" : "left"}
                                sx={{color: 'white', width: column.width, padding: '8px !important'}}
                                sortDirection={props.orderBy === column.property ? props.order : false}
                                >
                                {column.sortable && 
                                    <TableSortLabel 
                                        sx={{'& svg': {color: 'white !important'}}}
                                        active={props.orderBy === column.property} 
                                        direction={props.orderBy === column.property ? props.order : 'asc'} 
                                        onClick={createSortHandler(column.property)} />}
                                {column.header || column.property}
                            </TableCell>
                        ))}
                            {props.onEditRow ? (
                                <TableCell size='small'></TableCell>
                            ): null}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.data?.map((data) => (
                        <>
                        <TableRow 
                            sx={{cursor: props.onClickRow ? 'pointer': 'initial'}}
                            hover={Boolean(props.onClickRow)}
                            onClick={() => props.onClickRow?.(data)}>
                            {props.columns?.map((column) => (
                                <TableCell 
                                    padding="none"
                                    sx={{paddingLeft: '32px', height: '42px', width: column.width}}
                                    size={column.size}
                                    align={column.align == "center" ? "center" : "left"}>
                                        {column.render ? column.render?.(data || {}) : data?.[column.property]}
                                </TableCell>
                            ))}
                            {props.onEditRow ? (
                                <TableCell
                                    padding="none"
                                    align='right' 
                                    sx={{width: '40px', position: 'relative'}}>
                            
                                </TableCell>
                            ) : null}


<IconButton
                                sx={{zIndex: 12, position: 'absolute', top: 0, right: 0}}
                                onClick={() => props.onEditRow?.(data)}>
                                <MoreVert />
                            </IconButton>
                        </TableRow>
                        </>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
*/