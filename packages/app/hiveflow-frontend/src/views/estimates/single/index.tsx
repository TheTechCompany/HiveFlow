import { gql, useApolloClient, useQuery } from '@apollo/client';
import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
import { ChevronLeft as Previous, Download } from '@mui/icons-material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spreadsheet, { createEmptyMatrix } from "react-spreadsheet";
import { QuoteBuilder } from '../../../components/QuoteBuilder';
import { client, refetch, useMutation } from '@hive-flow/api';
import { debounce, throttle } from 'lodash';

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
                    order
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

    const [_estimate, setEstimate] = useState<{
        displayId?: string;
        name?: string;
        date?: Date;
        expiry?: Date;
        lineItems?: any[];
        terms?: string;
    }>({
        lineItems: []
    })

    useEffect(() => {
        setEstimate({
            ...estimate,
        })
    }, [JSON.stringify(estimate)])

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

    const debouncedUpdate = useMemo(() => debounce((args: any) => {
        updateLineItem(args).then(() => {
            refetch()
        })
    }, 1000), [])
    
    // const {cancel: cancelDebounce} = debouncedUpdate;

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
                sx={{bgcolor: 'secondary.main', color: 'navigation.main', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                <IconButton 
                    sx={{color: 'navigation.main'}}
                    onClick={() => navigate('../')}
                   >
                        <Previous fontSize='small' />
                </IconButton>
                <Typography>{_estimate.displayId} - {_estimate.name}</Typography>
                </Box>
                <Box>
                    <IconButton sx={{color: 'navigation.main'}}>
                        <Download />
                    </IconButton>
                </Box>
            </Box>
            <Box 
                sx={{flex: 1, overflow: 'auto', maxHeight: 'calc(100% - 36px)', display: 'flex'}}>
                <QuoteBuilder 
                    items={_estimate?.lineItems || []}
                    quoteId={_estimate?.displayId}
                    onUpdateRow={(id, key, value) => {
                        let items = _estimate.lineItems?.slice();
                        let ix = items.map((x) => x.id).indexOf(id)
                        items[ix] = {
                            ...items[ix],
                            [key]: value
                        }

                        setEstimate({
                            ..._estimate,
                            lineItems: items
                        })

                        // cancelDebounce()

                        debouncedUpdate({
                            args: {
                                id: id,
                                input: {
                                    [key]: value
                                }
                            }
                        })
                    }}
                    onDeleteRow={(id) => {
                        let items = _estimate.lineItems.slice();
                        let ix = items.map((a) => a.id).indexOf(id)
                        items.splice(ix, 1);
                        setEstimate({
                            ..._estimate,
                            lineItems: items
                        });

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
                        

                        setEstimate({
                            ..._estimate,
                            lineItems: [...lineItems, {}]
                        })
                    }}
                    />
            </Box>
        </Paper>
    )
}