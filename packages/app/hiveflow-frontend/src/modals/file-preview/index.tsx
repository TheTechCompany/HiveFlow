import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { FileViewer } from '@hexhive/ui'
import React from 'react';
import { gql, useQuery } from '@apollo/client';
import moment from 'moment';

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
                name
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
            maxWidth="lg"
            >
            <DialogTitle
                sx={{
                    padding: '8px',
                    fontSize: '1rem'
                }}
                // bgcolor={BaseStyle.global.colors['accent-2']}
                color={'white'}>File Preview</DialogTitle>
            <DialogContent sx={{display: 'flex', flexDirection: 'row', minWidth: '60vw', minHeight: '50vh'}} >
                <Box sx={{ border: "2px dashed #dfdfdf", borderRadius: '6px', flex: 0.6, display: 'flex'}}>
                    <FileViewer 
                        files={data?.filesById || []}
                        />
                </Box>
                <Box sx={{flex: 0.4, padding: '6px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                    <TextField 
                        fullWidth
                        size="small" 
                        label="Filename" 
                        value={data?.filesById?.[0]?.name || ''} />
                    <Typography>Uploaded By: {data?.filesById?.[0]?.uploadedBy?.name}</Typography>  
                    <Typography>Uploaded at: {moment(data?.filesById?.[0]?.createdAt).format('hh:mma - DD/MM/YY')}</Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}