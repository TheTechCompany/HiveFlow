import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { FileViewer } from '@hexhive/ui'
import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { BaseStyle } from '@hexhive/styles';

export interface FilePreviewDialogProps {
    files: string[];
    open: boolean;
    onClose?: () => void;
}

export const FilePreviewDialog : React.FC<FilePreviewDialogProps> = (props) => {

    const { data } = useQuery(gql`
        query FileInfo ($ids: [ID]) {
            filesById(ids: $ids) {
                id
                url
                mimeType

                uploadedBy {
                    name
                }

                createdAt
            }
        }
    `, {
        variables: {
            ids: props.files
        }
    })

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            >
            <DialogTitle
                sx={{
                    padding: '8px',
                    fontSize: '1rem'
                }}
                bgcolor={BaseStyle.global.colors['accent-2']}
                color={'white'}>File Preview</DialogTitle>
            <DialogContent sx={{display: 'flex', flexDirection: 'row'}} >
                <Box sx={{flex: 1}}>
                    <FileViewer 
                        files={data?.filesById || []}
                        />
                </Box>
                <Box sx={{flex: 1}}>
                    <Typography>Uploaded By: {data?.filesById?.[0]?.uploadedBy?.name}</Typography>  
                    <Typography>Uploaded at: {data?.filesById?.[0]?.createdAt}</Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}