import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, Paper, Tab, Tabs, TextField, Typography } from '@mui/material';
import { FileViewer } from '@hexhive/ui'
import React, { useEffect, useState } from 'react';
import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
import moment from 'moment';
import { CommentPane } from './panes/comment';

export interface FilePreviewDialogProps {
    files: any[];
    open: boolean;
    onClose?: () => void;
}

export const FilePreviewDialog : React.FC<FilePreviewDialogProps> = (props) => {

    const [ view, setView ] = useState('info');

    const [ activeIndex, setActiveIndex ] = useState(0);

    const client = useApolloClient()
    
    const refetch = () => {
        client.refetchQueries({include: ['FileInfo']})
    }

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

                comments {
                    id
                    comment
                    postedBy {
                        name
                    }
                    posted
                }

                createdAt
            }
        }
    `, {
        variables: {
            ids: props.files.map((x) => x.id)
        }
    })

    const COMMENT_MUTATION = gql`
        mutation Comment ($id: ID, $comment: String){
            commentOnFile(id: $id, comment: $comment){
                id
            }
        }
    `

    const [ comment ] = useMutation(COMMENT_MUTATION)

    const files = data?.filesById || [];

    console.log("PREVIEW", {files, fileProps: props.files, len: files.length});

    useEffect(() => {
        setActiveIndex(0)
    }, [files])
    // const getName = () => {
    //     return files.length == 1 ? files?.[0]?.name : "Multiple files";
    // }

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
                        index={activeIndex}
                        onChange={(index) => setActiveIndex(index)}
                        files={files || []}
                        />
                </Box>
                <Box sx={{flex: 0.4, padding: '6px', display: 'flex', flexDirection: 'column'}}>
                 
                    <Paper sx={{display: 'flex', flex: 1, flexDirection: 'column'}}>
                        <Box sx={{bgcolor: 'secondary.light'}}>
                            <Tabs 
                                value={view}
                                onChange={(e, value) => setView(value)}>
                                <Tab value={'info'} label="Info" />
                                <Tab value={'comments'} label="Comments" />
                            </Tabs>
                        </Box>
                        {view == 'info' ? (

                            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', paddingTop: '6px'}}>
                                <TextField 
                                    fullWidth
                                    size="small" 
                                    label="Filename" 
                                    value={files?.[activeIndex]?.name || ''} />
                                <Typography>Uploaded By: {files?.[activeIndex]?.uploadedBy?.name}</Typography>  
                                <Typography>Uploaded at: {moment(files?.[activeIndex]?.createdAt).format('hh:mma - DD/MM/YY')}</Typography>
                            </Box>
                        ) : (
                            <CommentPane 
                                onComment={(cmnt) => {
                                    comment({variables: {id: files?.[activeIndex]?.id, comment: cmnt }}).then(() => {
                                        refetch()
                                    })
                                }}
                                onDeleteComment={(comment) => {

                                }}
                                comments={files?.[activeIndex]?.comments || []}
                                
                                />
                        )}
                    </Paper>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

/*
[
                                    {
                                        name: 'Ross Leitch',
                                        comment: 'How about if it was bigger?',
                                        posted: new Date()
                                    }
                                ]}
*/