import React, {
  Component, useEffect, useState
} from 'react';

// import {RobustFileList} from '@hexhive/ui';
import './index.css';
import { Box, Typography, Button, TextField } from '@mui/material';

const pkg = require('../../../package.json')


export interface ProfileProps {
  user?: any;
}

export const Profile : React.FC<ProfileProps> = (props) => {
  const [ uploads, setUploads ] = useState<any[]>([])
  const [ password, setPassword ] = useState<string>('')
  const [ confirm, setConfirm ] = useState<string>('')
  const [ passwordsMatch, setPasswordsMatch ] = useState<boolean>(false);
 
  useEffect(() => {
    // utils.profile.getUploads().then((uploads) => {
    //   setUploads(uploads.map((x: any) => ({...x, uploaded: true})))
    // })
  }, [])


  const updatePassword = () => {
    if(password === confirm){
      // utils.profile.updatePassword(password).then((r) => {
      //   setPassword('')
      //   setConfirm('')
      // })
    }
  }

  return ( 
      <div className="profile-page">
        <div className="profile-top-half">
          <Box sx={{display: 'flex'}} className="profile-info">
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
              <Typography sx={{textAlign: 'left'}}>{props.user.name}</Typography>
              <Typography sx={{textAlign: 'left'}}>{props.user.email || props.user.phone}</Typography>

              <div style={{flex: 1}} className="password-update">
                <Typography>Password</Typography>
                <TextField 
                  name='password' 
                  type="password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password"
                  size="small"
                  variant="outlined" />
                <TextField 
                  name='confirm' 
                  type="password"
                  onChange={(e) => setConfirm(e.target.value)}
                  value={confirm} 
                  placeholder="Confirm New Password"
                  size="small"
                  variant="outlined" />
                <Button 
                  onClick={updatePassword}
                  variant="contained"
                  color="primary"
                  sx={{marginTop: '8px'}}>Change Password</Button>
              </div>
              <div>Version: {pkg.version}</div>
            </Box>
          </Box>
        </div>
        <div className="profile-bottom-half">
          <Box className="profile-uploads">
            <Box>
              <Typography>Uploaded Files</Typography>
              {/* <RobustFileList 
                cols={4}
                files={uploads} 
                onClick={() => {}} 
                onDeleteClick={() => {}}/> */}
            </Box>
          </Box>
        </div>
      </div>
    );
  
}
