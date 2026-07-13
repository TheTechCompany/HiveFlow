import { ListItem, List, Box, TextField, Avatar, Paper, Typography, Divider, IconButton } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import { Send } from '@mui/icons-material'

export interface CommentItemProps {
    postedBy?: {name: string};
    posted?: Date;
    comment?: string;
}

export const CommentItem : React.FC<CommentItemProps> = (props) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center'}}>
            <Avatar sx={{width: 24, height: 24, marginRight: '6px'}}>
                <Typography>{props.postedBy?.name?.split(' ')?.map((x) => x[0]).join('')}</Typography>
            </Avatar>
            <Box>
                <Box sx={{display: 'flex'}}>
                    {props.postedBy?.name} - {moment(props.posted).fromNow()}
                </Box>
                <Paper sx={{padding: '6px'}}>
                    {props.comment}
                </Paper>
            </Box>
        </Box>
    )
}

export interface CommentPaneProps {
    comments?: CommentItemProps[]
    onComment?: (comment: string) => void;
    onDeleteComment?: (comment: any) => void;
}

export const CommentPane : React.FC<CommentPaneProps> = (props) => {

    const [ newComment, setNewComment ] = useState('');

    return (
        <Box sx={{background: "#dfdfdf", maxHeight: 'calc(100% - 35px)', flex: 1,  display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: 1, maxHeight: '100%', overflow: 'auto' }}>
                <List>
                    {props.comments?.map((comment) => (
                        <ListItem>
                            <CommentItem {...comment} />
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Paper>
                <Divider />
                <Box sx={{display: 'flex', minHeight: '48px', alignItems: 'center'}}>
                    <TextField
                        variant='filled'
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => {
                            if(e.key == "Enter"){
                                props.onComment?.(newComment)
                                setNewComment('')
                            }
                        }}
                        fullWidth
                        size="small"
                        label="Comment" />
                    <IconButton onClick={() => {
                         props.onComment?.(newComment)
                         setNewComment('')
                    }}>
                        <Send />
                    </IconButton>
                </Box>
            </Paper>
        </Box>
    )
}