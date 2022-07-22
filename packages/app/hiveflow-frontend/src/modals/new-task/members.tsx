import { AvatarList } from '@hexhive/ui';
import { Box, Checkbox, IconButton, Menu, MenuItem } from '@mui/material';
import { Add } from '@mui/icons-material'
import React, { useRef, useState } from 'react';

export interface Member {
    id: string;
    name?: string;
    color?: string;
}
export interface MemberListProps {
    members?: Member[]
    onMembersChanged?: (members: Member[]) => void;
    data?: Member[]
}

export const MemberList : React.FC<MemberListProps> = (props) => {
    const addRef = useRef<any>();
    const [ open, setOpen ] = useState(false)

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AvatarList size={25} users={props.members || []} />
            <IconButton 
                onClick={() => setOpen(true)}
                ref={addRef}
                sx={{ color: 'white' }} size="small">
                <Add />
            </IconButton>
            <Menu
                sx={{ '& .MuiPaper-root': {maxHeight: '200px',  overflow: 'auto',}}}
                anchorEl={addRef.current}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                open={open}
                onClose={() => setOpen(false)}
                >
                {props.data?.map((item) => (
                    <MenuItem 
                    dense    
                    sx={{padding: '6px'}}
                    onClick={() => {
                        let members = props.members.slice();
                        let ix = members.map((x) => x.id).indexOf(item.id);
                        if(ix < 0){
                            members.push(item)
                        }else{
                            members.splice(ix, 1);
                        }
                        props.onMembersChanged?.(members || [])
                    }}>
                        <Checkbox 
                            sx={{padding: 0, marginRight: '6px'}}
                            disableRipple
                            size="small"    
                            checked={props.members.map((x) => x.id).indexOf(item.id) > -1} />
                        {item.name}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    )
}