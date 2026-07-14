import { AvatarList } from '@hexhive/ui';
import { Box, Checkbox, IconButton, Menu, MenuItem, TextField } from '@mui/material';
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
    /** When false, hides the add button — read-only display */
    editable?: boolean;
}

export const MemberList : React.FC<MemberListProps> = (props) => {
    const addRef = useRef<any>();
    const [ open, setOpen ] = useState(false)
    const [ search, setSearch ] = useState('')
    const editable = props.editable !== false; // default true

    const filtered = search
        ? (props.data ?? []).filter((m) =>
            (m.name ?? '').toLowerCase().includes(search.toLowerCase()))
        : (props.data ?? []);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AvatarList size={25} users={props.members || []} />
            {editable && (
              <>
                <IconButton 
                    onClick={() => { setOpen(true); setSearch(''); }}
                    ref={addRef}
                    sx={{ color: 'inherit' }} size="small">
                    <Add />
                </IconButton>
                <Menu
                    sx={{
                      '& .MuiPaper-root': { maxHeight: '300px', overflow: 'auto' },
                      '& .MuiList-root': { pt: 0 },
                    }}
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
                    <Box sx={{ px: 1.5, pt: 0.75, pb: 0.5, position: 'sticky', top: 0, bgcolor: '#fff', zIndex: 1 }}>
                      <TextField
                        variant="standard"
                        size="small"
                        placeholder="Search members…"
                        autoFocus
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                        fullWidth
                      />
                    </Box>
                    {filtered.map((item) => (
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
              </>
            )}
        </Box>
    )
}