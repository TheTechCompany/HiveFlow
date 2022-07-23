import { gql, useApolloClient, useQuery } from '@apollo/client';
import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
import { ChevronLeft as Previous } from '@mui/icons-material';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spreadsheet, { createEmptyMatrix } from "react-spreadsheet";
import { QuoteBuilder } from '../../../components/QuoteBuilder';
import { client, refetch, useMutation } from '@hive-flow/api';


export const EstimateSingle = (props) => {

    const navigate = useNavigate()
    const { id } = useParams()

    const client = useApolloClient();

    const { data } = useQuery(gql`
        query EstimateSingle($displayId: String){
            estimates(where: {displayId: $displayId}) {
                id
                displayId
                name
                status

                lineItems {
                    id
                    item
                    description
                    price
                    quantity
                    amount
                }
            }
        }
    `, {
        variables: {
            displayId: id
        }
    });


    const estimate = data?.estimates?.[0] || {};

    const lineItems = estimate?.lineItems || [];

    const [ createLineItem ] = useMutation((mutation, args: {input: any}) => {
        const item = mutation.createEstimateLineItem({estimate: id, input: {
            ...args.input
        }})
        return {
            item: {
                ...item
            }
        }
    })

    const [ updateLineItem ] = useMutation((mutation, args: {id: string, input: any}) => {
        const item = mutation.updateEstimateLineItem({estimate: id, id: args.id, input: {
            ...args.input
        }})  
        return {
            item: {
                ...item
            }
        }
    })
    const [ deleteLineItem ] = useMutation((mutation, args: {id: string}) => {
        const item = mutation.deleteEstimateLineItem({estimate: id, id: args.id})
        return {
            item: {
                ...item
            }
        }
    })

    const refetch = () => {
        client.refetchQueries({include: ['EstimateSingle']})
    }
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
                    onUpdateRow={(id, key, value) => {
                        // let items = lineItems.slice();
                        // items[ix][key] = value;
                        // setLineItems(items)
                        updateLineItem({
                            args: {
                                id: id,
                                input: {
                                    [key]: value
                                }
                            }
                        }).then(() => {
                            refetch()
                        })
                    }}
                    onDeleteRow={(id) => {
                        // let items = lineItems.slice();
                        // items.splice(ix, 1);
                        // setLineItems(items);
                        deleteLineItem({
                            args: {
                                id: id
                            }
                        }).then(() => {
                            refetch()
                        })
                    }}
                    onAddRow={() => {
                        createLineItem({
                            args: {
                                input: {

                                }
                            }
                        }).then(() => {
                            refetch()
                        })
                        // setLineItems([...lineItems, {}])
                    }}
                    />
            </Box>
        </Paper>
    )
}