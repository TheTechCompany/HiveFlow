import { gql, useQuery } from '@apollo/client';
import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
import { ChevronLeft as Previous } from '@mui/icons-material';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spreadsheet, { createEmptyMatrix } from "react-spreadsheet";
import { QuoteBuilder } from '../../../components/QuoteBuilder';


export const EstimateSingle = (props) => {

    const navigate = useNavigate()
    const { id } = useParams()

    const { data } = useQuery(gql`
        query Q($displayId: String){
            estimates(where: {displayId: $displayId}) {
                id
                displayId
                name
                status
            }
        }
    `, {
        variables: {
            displayId: id
        }
    });


    const estimate = data?.estimates?.[0] || {};

    const [ lineItems, setLineItems ] = useState([])

    return (
        <Paper    
            sx={{flex: 1, display: 'flex', flexDirection: 'column'}}
         >
            <Box
                sx={{bgcolor: 'secondary.main', color: 'navigation.main', display: 'flex', alignItems: 'center'}}>
                <IconButton 
                    sx={{color: 'navigation.main'}}
                    onClick={() => navigate('../')}
                   >
                        <Previous fontSize='small' />
                </IconButton>
                <Typography>{estimate.displayId} - {estimate.name}</Typography>
            </Box>
            <Box 
                sx={{flex: 1, overflow: 'auto', maxHeight: 'calc(100% - 36px)', display: 'flex'}}>
                <QuoteBuilder 
                    items={lineItems}
                    onUpdateRow={(ix, key, value) => {
                        let items = lineItems.slice();
                        items[ix][key] = value;
                        setLineItems(items)
                    }}
                    onDeleteRow={(ix) => {
                        let items = lineItems.slice();
                        items.splice(ix, 1);
                        setLineItems(items);
                    }}
                    onAddRow={() => {
                        setLineItems([...lineItems, {}])
                    }}
                    />
            </Box>
        </Paper>
    )
}