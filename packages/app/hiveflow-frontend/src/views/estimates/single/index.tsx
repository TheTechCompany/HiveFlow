import { gql, useQuery } from '@apollo/client';
import { Box, Button, Text } from 'grommet';
import { Previous } from 'grommet-icons';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spreadsheet, { createEmptyMatrix } from "react-spreadsheet";

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

    return (
        <Box    
            round="xsmall"
            overflow={"hidden"}
            flex 
            background={'light-1'}>
            <Box
                pad="xsmall"
                gap="xsmall"
                background={'accent-2'}
                direction='row'>
                <Button 
                    onClick={() => navigate('../')}
                    hoverIndicator
                    plain
                    style={{padding: 6, borderRadius: 3}} 
                    icon={<Previous size='small' />} />
                <Text>{estimate.displayId} - {estimate.name}</Text>
            </Box>
            <Box 
                background={'white'}
                overflow={'scroll'}
                flex>
                <Spreadsheet 
                    data={createEmptyMatrix(50, 50).map((row, rix) => row.map((col) => ({value: ''})))} />
            </Box>
        </Box>
    )
}