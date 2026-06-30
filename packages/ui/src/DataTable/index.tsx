import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableSortLabel, IconButton, Box, Typography } from '@mui/material';
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

    const hasActions = Boolean(props.onEditRow);

    return (
        <TableContainer sx={{ flex: 1 }}>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        {props.columns?.map((column) => (
                            <TableCell
                                key={column.property}
                                size={column.size || 'small'}
                                align={(column.align === "center" ? "center" : "left") as any}
                                sx={{
                                    color: 'white',
                                    bgcolor: 'secondary.main',
                                    width: column.size ? getSize(column.size) : column.width,
                                    padding: '6px 8px !important',
                                    fontWeight: 600,
                                }}
                                sortDirection={props.orderBy === column.property ? props.order : false}
                            >
                                {column.sortable ? (
                                    <TableSortLabel
                                        sx={{ '& svg': { color: 'white !important' } }}
                                        active={props.orderBy === column.property}
                                        direction={props.orderBy === column.property ? props.order : 'asc'}
                                        onClick={createSortHandler(column.property)}
                                    >
                                        <Typography variant="body2" fontWeight={600}>
                                            {column.header || column.property}
                                        </Typography>
                                    </TableSortLabel>
                                ) : (
                                    <Typography variant="body2" fontWeight={600}>
                                        {column.header || column.property}
                                    </Typography>
                                )}
                            </TableCell>
                        ))}
                        {hasActions && (
                            <TableCell size="small" sx={{ bgcolor: 'secondary.main', width: 48, padding: 0 }} />
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.data?.map((row) => (
                        <TableRow
                            key={row.id}
                            hover={Boolean(props.onClickRow)}
                            sx={{
                                cursor: props.onClickRow ? 'pointer' : 'initial',
                                '&:last-child td': { borderBottom: 0 },
                            }}
                            onClick={() => props.onClickRow?.(row)}
                        >
                            {props.columns?.map((column) => (
                                <TableCell
                                    key={column.property}
                                    padding="none"
                                    size={column.size || 'small'}
                                    align={(column.align === "center" ? "center" : "left") as any}
                                    sx={{
                                        px: 1,
                                        py: 0.5,
                                        width: column.size ? getSize(column.size) : column.width,
                                    }}
                                >
                                    {column.render ? column.render(row) : row?.[column.property]}
                                </TableCell>
                            ))}
                            {hasActions && (
                                <TableCell padding="none" sx={{ width: 48, textAlign: 'right', pr: 0.5 }}>
                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); props.onEditRow?.(row); }}>
                                        <MoreVert fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}