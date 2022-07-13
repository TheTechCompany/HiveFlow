import React, {
  lazy,
  Component, useEffect, useState
} from 'react';

import {Button } from 'grommet';

import { Divider, Menu, Typography, Tabs, Tab, MenuItem ,Box,  MenuList, Paper } from '@mui/material'
// import SharedFiles from '@hexhive/auth-ui';

import { files as fileActions } from '../../../actions'

import moment from 'moment';

// import utils from '../../../utils';

import { Kanban, FileDialog, FileExplorer, Timeline } from '@hexhive/ui';

import { useMutation, useRefetch } from '@hive-flow/api';
import { KanbanModal } from './KanbanModal';
import { gql, useApolloClient, useMutation as useApolloMutation, useQuery } from '@apollo/client'
import { Outlet, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { TimelinePane, FilePane, KanbanPane } from './panes';
import { ProjectSingleProvider } from './context';
import { TaskModal } from '../../../modals/new-task';

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

  const navigate = useNavigate();

  const client = useApolloClient()

  const [taskModalOpen, openTaskModal] = useState(false);
  const [ selectedTask, setSelectedTask ] = useState<any>();

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

  const { pathname } = useLocation()
console.log({pathname})


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
    
        tasks {
          id

          title
          description
          startDate
          endDate
          status

          lastUpdated

          dependencyOn {
            id
            title
            status
            endDate
          }
          dependencyOf {
            id
            title
            status
            endDate
          }
        }
      }
    }
  `, {
    variables: {
      id: job_id,
    }
  })

  
  const refetch = () => {
    client.refetchQueries({include: ['GetProject']})
  }



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
      path: "tickets",
      element: <KanbanPane />
    },
    {
      title: "Timeline",
      path: "timeline",
      element: <TimelinePane />
    },
    {
      title: "Files",
      path: "files",
      element: <FilePane />
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

  const view = _tabs.find((a) => pathname.indexOf(a.path) > -1)?.path

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
        <Typography >{startDate.format('DD/MM/YYYY')} - {endDate.format('DD/MM/YYYY')}</Typography>
      );
    } else {
      return null;
    }
  }

  const renderJobDescription = () => {
    return (
      <Box style={{ flex: 0.5 }}>
        <Box className="job-description">
          <Typography>{job?.name}</Typography>
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

  const [ createTask ] = useMutation((mutation, args: any) => {
    const item = mutation.createProjectTask({input: args.input})
    return {
      item: {
        ...item
      }
    }
  })

  const [ updateTask ] = useMutation((mutation, args: any) => {
    const item = mutation.updateProjectTask({id: args.id, input: args.input})
    return {
      item: {
        ...item
      }
    }
  })

  const [ deleteTask ] = useMutation((mutation, args: any) => {
    const item = mutation.deleteProjectTask({id: args.id})
    return {
      item: {
        ...item
      }
    }
  })

  const [ createTaskDependency ] = useMutation((mutation, args: any) => {
    const item = mutation.createProjectTaskDependency({project: job_id, source: args.source, target: args.target});
    return {
      item: {
        ...item
      }
    }
  })


  const [ deleteTaskDependency ] = useMutation((mutation, args: any) => {
    const item = mutation.deleteProjectTaskDependency({project: job_id, source: args.source, target: args.target});
    return {
      item: {
        ...item
      }
    }
  })
  

  return (
    <ProjectSingleProvider value={{
      projectId: job_id, 
      tasks: job?.tasks || [],
      finishTtl: 60 * 1000 * 60 * 24,
      refetch,
      updateTaskStatus: (taskId, status) => {
          updateTask({
            args: {
              id: taskId,
              input: {
                status,
                projectId: job_id
              }
            }
          }).then(() => {
            refetch()

          })
      },
      createTask: (task: any) => {
        console.log({task})

        setSelectedTask({...task, id: undefined, status: task.status, startDate: task.start, endDate: task.end})
        openTaskModal(true);
      },
      updateTask: (task: any) => {
        setSelectedTask({...task, startDate: task.start, endDate: task.end})
        openTaskModal(true)
      },
      deleteTask: () => {

      },
      deleteDependency: (source: string, target: string) => {
        deleteTaskDependency({
          args: {
            source,
            target
          }
        }).then(() => {
          refetch();
        })
      },
      createDependency: (source: string, target: string) => {
        createTaskDependency({
          args: {
            source,
            target
          }
        }).then(() => {
          refetch();
        })
      }
    }}>
    <Box
      sx={{flex: 1, display: 'flex', flexDirection: 'column'}}
  
      className="job-one-container" style={{ flex: 1, display: 'flex' }}>
      
      <TaskModal 
        onClose={() => {
          openTaskModal(false)
          setSelectedTask(null)
        }}
        onDelete={async () => {
          if(!selectedTask) return;

          await deleteTask({
            args: {
              id: selectedTask?.id
            }
          })
          refetch();

          setSelectedTask(null)
          openTaskModal(false)
          
        }}
        selected={selectedTask}
        onSubmit={async (task) => {
          if(task.id){
            //Update
            await updateTask({
              args: { 
                id: task.id, 
                input: {
                   title: task.title,
                   description: task.description, 
                   startDate: task.startDate,
                   endDate: task.endDate,
                    status: task.status,
                   id: undefined, 
                   projectId: job_id 
                }
             }
            })
          }else{
            //Create
            await createTask({
              args: {
                 input: {
                  title: task.title,
                  description: task.description, 
                  startDate: task.startDate,
                  endDate: task.endDate,
                  status: task.status,
                  id: undefined, 
                  projectId: job_id 
                } 
              }
            })
          }
          refetch();

          setSelectedTask(null)
          openTaskModal(false)
        }}
        open={taskModalOpen} />

      <Paper sx={{display: 'flex', bgcolor: 'secondary.main', justifyContent: 'space-between', alignItems: 'center'}}>
        <Typography sx={{marginLeft: '6px', padding: '6px', color: 'navigation.main'}} fontWeight="bold">{job?.displayId} - {job?.name || "Job Title"}</Typography>
        <Box sx={{display: 'flex'}}>
        <Tabs 
          onChange={(e, value) => navigate(value)}
          value={view}>
          {_tabs.map((tab) => (
            <Tab value={tab.path} label={tab.title} />
          ))}
         
        </Tabs>
        {/* <Button
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
            label="Files" /> */}

        </Box>
      </Paper>
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


      <Paper sx={{marginTop: '4px', flex: 1, display: 'flex'}}>
        <Routes>
          <Route path="" element={<Outlet />}>
            {_tabs?.map((tab) => (
              <Route path={tab.path} element={tab.element} />
            ))}
          </Route>
        </Routes>
        {/* <Box
          sx={{flex: 1, display: 'flex'}}>

          {_tabs[selectedTab].component}
        </Box> */}

      </Paper>

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
