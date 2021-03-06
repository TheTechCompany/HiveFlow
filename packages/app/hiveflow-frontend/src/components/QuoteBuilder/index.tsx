import { Box, Button, Divider, IconButton, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField, Typography } from "@mui/material";
import React, { useMemo } from "react";

import { Delete } from '@mui/icons-material'

export interface QuoteItem {
    id: string;
    order: number;

    item: string;
    description: string;

    quantity: number;
    price: number;
}

export interface QuoteBuilderProps {
    items?: QuoteItem[];
    quoteId?: string;
    date?: Date;
    expiry?: Date;
    customer?: string;
    onAddRow?: () => void;
    onDeleteRow?: (id: string) => void;
    onUpdateRow?: (id: string, key: string, value: any) => void;
}


const formatter = new Intl.NumberFormat(Intl.NumberFormat().resolvedOptions().locale, {maximumFractionDigits: 2, minimumFractionDigits: 2}) //(, {maximumSignificantDigits: 2})

export const QuoteBuilder : React.FC<QuoteBuilderProps> = (props) => {

    const itemKeys = [
        {label: 'Item', key: 'item'}, 
        {label: 'Description', key: 'description', multiline: true}, 
        {label: 'Quantity', type: 'number', key: 'quantity'}, 
        {label: 'Price', type: 'number', key: 'price'}, 
        {label: 'Amount', type: 'number', key: 'amount', func: (item: any) => item.price * item.quantity}
    ]

    const total = useMemo(() => {
        return props.items?.reduce((prev, curr) =>  prev + ((curr.quantity || 0) * (curr.price || 0)), 0)
    }, [props.items])

    return (
        <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: '6px', paddingRight: '6px'}}>
            <Box sx={{display: 'flex', marginTop: '6px', marginBottom: '6px'}}>
                <Box sx={{flex: 1}}>
                    <TextField fullWidth size="small" label="Customer" />
                </Box>
                <Box sx={{display: 'flex', flex: 1}}>
                    <TextField size="small" value={props.date} fullWidth label="Date" />
                    <TextField size="small" value={props.expiry} fullWidth label="Expiry" />
                    <TextField size="small" value={props.quoteId} fullWidth label="Quote Number" InputProps={{startAdornment: <InputAdornment position="start">#</InputAdornment>}} />
                </Box>
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <TextField size="small" label="Reference" />
            </Box>
            <Box sx={{display: 'flex', backgroundClip: 'border-box', borderRadius: '3px', marginTop: '6px', marginBottom: '20px', boxShadow: '0 0 0 1px #ccced2 inset'}}>
                    <Table sx={{height: 1}}>
                        <TableHead sx={{ bgcolor: 'unset', position: 'relative', border: '1px solid #dfdfdf'}}>
                            <TableRow>
                                {itemKeys.map((key, ix) => (
                                    <TableCell sx={{padding: '3px', borderTopLeftRadius: ix == 0 ? '3px' : 0, bgcolor: 'secondary.main', overflow: 'hidden'}}>
                                        {key.label}
                                    </TableCell>
                                ))}
                                <TableCell  sx={{ borderTopRightRadius: '3px', width: '20px', bgcolor: 'secondary.main',}} />
                            </TableRow>
                        </TableHead>
                        <TableBody >
                            {props.items?.map((item, ix) => (
                                <TableRow
                                    key={item.id} >
                                    {itemKeys.map((key) => (
                                        <TableCell sx={{padding: 0, height: '0'}}>
                                            <TextField 
                                                multiline={key.multiline}
                                                type={key.type}
                                                onChange={(e) => {
                                                    let value : any = e.target.value;
                                                    if(key.type == 'number'){
                                                        value = parseFloat(value);
                                                    }
                                                    props.onUpdateRow?.(item.id, key.key, value)
                                                }}
                                                sx={{height: '100%', flex: 1, '& .MuiOutlinedInput-input': {height: '100%'}, '& .MuiOutlinedInput-root': {height: '100%', borderRadius: 0}}}
                                                fullWidth
                                                size="small" 
                                                value={(key.func ? key.func(item) : item[key.key]) || ''} />
                                        </TableCell>
                                    ))}
                                    <TableCell sx={{width: '20px', padding: 0}}>
                                        <IconButton 
                                            onClick={() => {
                                                props.onDeleteRow?.(item.id)
                                            }}
                                            size="small">
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                          
                        </TableBody>
                        <TableFooter sx={{border: '1px solid #dfdfdf'}}>
                            <TableRow sx={{display: 'flex'}}>
                                <Button sx={{margin: '3px'}} variant="contained" onClick={props.onAddRow}>
                                    Add Row
                                </Button>
                                <Box sx={{flex: 1}}>
                                    
                                </Box>
                            </TableRow>
                        </TableFooter>
                    </Table>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'flex-start'}}>
                <Box sx={{flex: 1}}>
                    <TextField fullWidth label="Terms" minRows={4} multiline />
                </Box>
                <Box sx={{paddingLeft: '10%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
                    <Box>
                        <Box sx={{display: 'flex', alignItems: 'center',  justifyContent: 'space-between'}}>
                            <Typography fontSize="large">Subtotal:</Typography>
                            <Typography fontSize="large">{formatter.format(total)}</Typography>
                        </Box>
                        <Box sx={{display: 'flex', alignItems: 'center',  justifyContent: 'space-between'}}>
                            <Typography fontSize="large">Total GST:</Typography>
                            <Typography fontSize="large">{formatter.format((total * 1.15) - (total))}</Typography>
                        </Box>
                        <Divider />
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Typography fontSize="large">Total:</Typography>
                            <Typography fontWeight={"bold"} fontSize="25px">{formatter.format(total * 1.15)}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}