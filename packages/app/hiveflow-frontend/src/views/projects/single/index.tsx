import React, {
  lazy,
  Component, useEffect, useState
} from 'react';

import { Tabs, Text, Tab, Box, Heading, Spinner, Button } from 'grommet';

import { Divider, Menu, MenuItem, MenuList } from '@mui/material'
// import SharedFiles from '@hexhive/auth-ui';

import { files as fileActions } from '../../../actions'

import moment from 'moment';

// import utils from '../../../utils';

import { Kanban, FileDialog, FileExplorer, Timeline } from '@hexhive/ui';

import { useMutation, useRefetch } from '@hive-flow/api';
import { KanbanModal } from './KanbanModal';
import { gql, useApolloClient, useMutation as useApolloMutation, useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom';
import { TimelinePane, FilePane, KanbanPane } from './panes';
import { ProjectSingleProvider } from './context';

// const FileExplorer = lazy(() => {
//   //@ts-ignore
//   return import('hexhive_hivefiles/Explorer').then((r) => {
//     console.log(r)
//     return {default: r.Explorer}
//   })
// })

export interface ProjectSingleProps {
  match?: {
    id?: any,
    job?: any;
  }
}



export const ProjectSingle: React.FC<ProjectSingleProps> = (props) => {

  const client = useApolloClient()

  const [kanbanMenuVisible, showKanbanMenu] = useState<boolean>(false);

  const [selectedColumn, setSelectedColumn] = useState<any>();

  const [selectedTab, setSelectedTab] = useState<number>(0)

  const [loadingFiles, setLoadingFiles] = useState<any[]>([])
  const [uploadingFiles, setUploadingFiles] = useState<any[]>([])

  const [dialogOpen, openDialog] = useState<boolean>(false)

  const [showFiles, setShowFiles] = useState<any[]>([]);

  const [assignedEmployees, setAssignedEmployees] = useState<any[]>([])

  const [comment, setComment] = useState<string>('')
  const [uploadFile, setUploadFile] = useState<string>('')

  const [description, setDescription] = useState<string>('')

  const { id: job_id, jobParam } = useParams()




  // const query = useQuery({
  //   suspense: false,
  //   staleWhileRevalidate: true
  // })

  const { data } = useQuery(gql`
    query GetProject($id: String) {
      projects(where: {displayId: $id}){
        id
        displayId
        name
        startDate
        endDate
    
      }
    }
  `, {
    variables: {
      id: job_id,
    }
  })

  



  const job = data?.projects?.[0] //query.projects({where: {id: job_id}})?.[0]

  useEffect(() => {
    console.log("JOB Changed")
    // if(job && job.files){
    //   console.log(job.files)
    //   setFiles(job.files || [])
    // }
  }, [JSON.stringify(job)])



  const _tabs = [
   
    {
      title: "Tickets",
      component: <KanbanPane />
    },
    {
      title: "Timeline",
      component: <TimelinePane />
    },
    {
      title: "Files",
      component: <FilePane />
      // (
      // <SharedFiles
      //   loading={loadingFiles}
      //   uploading={uploadingFiles}

      //   onClick={(item) => {
      //     setShowFiles([item])
      //     openDialog(true)
      //   }}
      //   files={(files || []).filter((a) => {
      //     if(a.status == "Finished"){
      //       let ttl = 14 * 24 * 60 * 60 * 1000;
      //       return Date.now() - dateFromObjectID(a.id).getTime() < ttl;
      //     }
      //     return true;
      //   })
      // }
      // onDelete={async (_files) => {
      //   console.log(_files)
      //   await Promise.all(_files.map(async (file) => {
      //     // if(job?.id) await removeFile({args: {project: job?.id, id: file._id}})
      //   }))

      // }}
      // onUpload={(files) => {
      //   fileActions.addFilesToJob(job_id, files).then(async (result) => {
      //     console.log("Upload result", result)
      //     await refetch(query.projects({where: {id: job_id}}))
      //   })
      // }}
      // onEdit={(files) => {
      //   openDialog(true)
      //   setShowFiles(files)
      // }}
      // onView={(files) => {
      //   openDialog(true)
      //   setShowFiles(files)
      // }}
      // onChange={(files) => setFiles(files)}
      // jobId={job_id} />)
    },
  ]

  const UseLoading = (id: string) => {
    setLoadingFiles(Array.from(new Set([...loadingFiles, id])))

    return () => {
      let f = loadingFiles.slice() || [];
      let ix = f.indexOf(id)

      f.splice(ix, 1)
      setLoadingFiles(f)
    }
  }

  useEffect(() => {
    if (jobParam) {
      /* utils.job.getDetails(props.match.params.job).then((job) => {
          console.log("JOB", job)
          setJob(job[0])
        })
  */

      // utils.job.getFiles(props.match.params.job)
    }
  }, [jobParam])





  const renderJobDuration = () => {
    if (job?.startDate) {
      let startDate = moment(job?.startDate, 'DD/MM/YYYY');
      let endDate = moment(job?.endDate, 'DD/MM/YYYY') //.add(job.Duration, job.DurationType);
      return (
        <Text style={{ fontSize: 14 }}>{startDate.format('DD/MM/YYYY')} - {endDate.format('DD/MM/YYYY')}</Text>
      );
    } else {
      return null;
    }
  }

  const renderJobDescription = () => {
    return (
      <Box style={{ flex: 0.5 }}>
        <Box className="job-description">
          <Text style={{ textAlign: 'left' }}>{job?.name}</Text>
          {renderJobDuration()}
        </Box>
      </Box>
    );
  }

  const renderBody = () => {
    return (
      <div className="job-body" style={{ flex: 0.7, display: 'flex', flexDirection: 'column' }}>
        {renderJobDescription()}
      </div>
    );
  }

  return (
    <ProjectSingleProvider value={{projectId: job_id}}>
    <Box
      direction="column"
      round="xsmall"
      className="job-one-container" style={{ flex: 1, display: 'flex' }}>
      <Box
        round="xsmall"
        background="accent-1"
        pad={{ left: 'small' }}
        direction="row"
        margin={{ bottom: 'xsmall' }}
        justify="between">
        <Heading level='4' margin="small">{job?.displayId} - {job?.name || "Job Title"}</Heading>
        <Box gap="xsmall" direction="row">
        <Button
            onClick={() => setSelectedTab(0)}
            style={{ borderBottom: selectedTab == 0 ? '3px solid #E75D3D' : undefined, padding: 8 }}
            plain
            hoverIndicator
            label="Tickets" />
          <Button
            onClick={() => setSelectedTab(1)}
            style={{ borderBottom: selectedTab == 1 ? '3px solid #E75D3D' : undefined, padding: 8 }}
            plain
            hoverIndicator
            label="Timeline" />
          <Button
            onClick={() => setSelectedTab(2)}
            style={{ borderBottom: selectedTab == 2 ? '3px solid #E75D3D' : undefined, padding: 8 }}
            plain
            hoverIndicator
            label="Files" />

        </Box>
      </Box>
      <FileDialog
        open={dialogOpen}
        onSubmit={async (_files: any[]) => {
          console.log(_files)
          if (_files.length == 1) {
            let file = _files[0]

            if (file.id) {
              const loaded = UseLoading(file.id);

              // updateFile({args: {id: file.id, name: file.name || '', status: file.status || ''}}).then(({item}) => {
              //   console.log(item)

              //   let f = files?.slice()
              //   let ix = f.map((x: any) => x.id).indexOf(file.id)

              //   item.id = file.id;

              //   if(ix > -1){
              //     f[ix] = {
              //       ...item
              //     }
              //   }

              //   loaded()
              // })
            }
            /*
            utils.job.updateFile(job?.id, file.id, file).then((resp) => {
              console.log("Updated", resp)
              let f = files?.slice()
              let ix = f.map((x: any) => x.id).indexOf(file.id)

              console.log(f, ix, file )
              if(ix > -1){
                f[ix] = {
                  ...file
                }
              }

              setFiles(f)
            })*/
          } else if (_files.length > 1) {
            let ids = _files.map((x) => x.id)
            // const results = await updateFiles({args: {ids: ids, status: _files[0].status}})

            // console.log(results)


            // const results = await Promise.all(_files.map(async (file :any) => {
            //   await updateFile({args: {id: file.id, status: file.status}})
            // }))


          }

        }}
        onClose={() => {
          console.log("CLose")
          openDialog(false)
          setShowFiles([])
        }}
        files={showFiles}
        job={job?.id} />


      <Box round="xsmall" flex background="neutral-1">
        <Box
          height="100%"
          flex>
          {_tabs[selectedTab].component}
        </Box>

      </Box>

      <KanbanModal
        column={selectedColumn}
        open={kanbanMenuVisible}
        onClose={() => showKanbanMenu(false)} />

    </Box>
    </ProjectSingleProvider>
  );

}

// export default connect((state: StoreState) => ({
//   token: state.auth.token
// }))(FocusedJob);
