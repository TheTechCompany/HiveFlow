import React, {
  lazy,
  Component, useEffect, useState
} from 'react';


import { Divider, Menu, Typography, Tabs, Tab, MenuItem ,Box,  MenuList, Paper } from '@mui/material'
// import SharedFiles from '@hexhive/auth-ui';

import { files as fileActions } from '../../../actions'

import moment from 'moment';

// import utils from '../../../utils';

import { FileDialog, FileExplorer } from '@hexhive/ui';

import { useApolloClient, useMutation, useQuery } from '@apollo/client'
import {
  GET_PROJECT,
  UPDATE_PROJECT_TASK,
  CREATE_PROJECT_TASK,
  DELETE_PROJECT_TASK,
  CREATE_PROJECT_TASK_DEPENDENCY,
  DELETE_PROJECT_TASK_DEPENDENCY,
} from '@hive-flow/api';
import { KanbanModal } from './KanbanModal';
import { Outlet, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { TicketsPane, FilePane, InfoPane } from './panes';
import { ProjectSingleProvider } from './context';
import { TaskModal } from '../../../modals/new-task';

import { arrayMove } from '@dnd-kit/sortable'
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

  const { data } = useQuery(GET_PROJECT, {
    variables: {
      id: job_id,
    },
    fetchPolicy: 'network-only',
  })

  

  const allSkills = data?.skills || [];

  const refetch = () => {
    client.refetchQueries({include: ['GetProject']})
  }


  const users = data?.users || [];

  const job = data?.projects?.[0]

  // Keep selectedTask in sync with refetched data so subtasks etc. update
  useEffect(() => {
    if (selectedTask?.id && job?.tasks) {
      const refreshed = job.tasks.find((t: any) => t.id === selectedTask.id);
      if (refreshed) {
        setSelectedTask((prev: any) => ({
          ...prev,
          children: refreshed.children,
          ...refreshed,
          startDate: refreshed.start,
          endDate: refreshed.end,
        }));
      }
    }
  }, [job?.tasks]);

  useEffect(() => {
    console.log("JOB Changed")
    // if(job && job.files){
    //   console.log(job.files)
    //   setFiles(job.files || [])
    // }
  }, [JSON.stringify(job)])



  const _tabs = [
   
    {
      title: "Info",
      path: "info",
      element: <InfoPane project={job} users={users} onRefetch={refetch} />
    },
    {
      title: "Tickets",
      path: "tickets",
      element: <TicketsPane />
    },
    {
      title: "Files",
      path: "files",
      element: <FilePane />
    },
    // Batches tab hidden for now
    // {
    //   title: "Batches",
    //   path: "batches/*",
    //   element: <BatchView />
    // },
  ]

  const view = _tabs.find((a) => pathname.indexOf(a.path) > -1)?.path?.replace('/*', '')

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

  const [createTask] = useMutation(CREATE_PROJECT_TASK);
  const [updateTask] = useMutation(UPDATE_PROJECT_TASK);
  const [deleteTask] = useMutation(DELETE_PROJECT_TASK);
  const [createTaskDependency] = useMutation(CREATE_PROJECT_TASK_DEPENDENCY);
  const [deleteTaskDependency] = useMutation(DELETE_PROJECT_TASK_DEPENDENCY);

  return (
    <ProjectSingleProvider value={{
      projectId: job_id, 
      tasks: job?.tasks || [],
      finishTtl: (60 * 1000) * 60 * 24 * 7, //7 days
      refetch,
      updateTaskStatus: (taskId, index, status) => {
        let statusTasks = job?.tasks?.filter((a) => a.status == status)?.sort((a,b) => a.columnRank?.localeCompare(b.columnRank));
                
        const ix = statusTasks.map((x) => x.id).indexOf(taskId);

        statusTasks = arrayMove(statusTasks, ix, index);

        let above = statusTasks?.[index -1]?.id;
        let below = statusTasks?.[index + 1]?.id

          updateTask({
            variables: {
              id: taskId,
              input: {
                status,
                above: above != taskId ? above : undefined,
                below: below != taskId ? below : undefined,
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
          variables: {
            source,
            target
          }
        }).then(() => {
          refetch();
        })
      },
      createDependency: (source: string, target: string) => {
        createTaskDependency({
          variables: {
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
        users={users}
        skills={allSkills}
        onClose={() => {
          openTaskModal(false)
          setSelectedTask(null)
        }}
        onAddSubtask={async (parentId, title) => {
          await createTask({
            variables: {
              input: { title, parentId, status: 'Backlog', projectId: job_id }
            }
          });
          refetch();
        }}
        onSelectTask={(taskId) => {
          const task = job?.tasks?.find((t: any) => t.id === taskId);
          if (task) {
            setSelectedTask({ ...task, startDate: task.start, endDate: task.end });
          }
        }}
        onDelete={async () => {
          if(!selectedTask) return;

          await deleteTask({
            variables: {
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
              variables: { 
                id: task.id, 
                input: {
                   title: task.title,
                    members: task.members,
                    requiredSkills: task.requiredSkills,
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
              variables: {
                 input: {
                  title: task.title,
                  members: task.members,
                  requiredSkills: task.requiredSkills,
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
            <Tab value={tab.path.replace('/*', '')} label={tab.title} />
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
