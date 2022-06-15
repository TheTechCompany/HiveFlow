import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { FileViewer } from '@hexhive/ui'
import React from 'react';
import { gql, useQuery } from '@apollo/client';

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
            <DialogTitle>File Preview</DialogTitle>
            <DialogContent>
                <FileViewer 
                    files={data?.filesById || []}
                    />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}