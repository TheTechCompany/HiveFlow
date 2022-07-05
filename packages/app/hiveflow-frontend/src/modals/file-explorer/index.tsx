import React, { useState } from 'react'

import { FileExplorerModal } from '@hexhive/ui'
import { ThemeProvider } from '@mui/material'
import { theme } from '../../App'
import { gql, useQuery } from '@apollo/client'

export const ExplorerModal = (props: any) => {

    const [ path, setPath ] = useState('/')

    const { data } = useQuery(gql`
    query GetFiles ($id: ID, $path: String) {
        projects(where: {displayId: $id}){
                
            files(path: $path) {
                id
                name
                directory
                size
            }
        
        }
    }
    `, {
        variables: {
            id: props.projectId,
            path: path
        }
    })

    return (
        <ThemeProvider theme={theme}>
            <FileExplorerModal  
                files={data?.projects?.[0]?.files || []}
                path={path}
                onPathChange={(path) => setPath(path)}
                onSubmit={props.onSubmit}
                open={props.open} />
        </ThemeProvider>
    )
}