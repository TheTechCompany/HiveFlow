import { refetch, useMutation, useQuery } from '@hive-flow/api';
import { useTypeConfiguration } from '../../../context';
import { Box, TextInput, Select } from 'grommet';
import React, {
  Component, useEffect, useState
} from 'react';
import { useNavigate } from 'react-router-dom';

import { DataTable } from '../../../components/DataTable'

// import { useQuery } from '../../../gqless';
import { Header } from './header';
import { Project, ProjectModal } from '../../../modals/project';
import { Paper } from '@mui/material';

export interface ProjectListProps {
}

export const ProjectList : React.FC<ProjectListProps> = (props) => {
  
  const [ modalOpen, openModal ] = useState(false);
  const [ modalError, setModalError ] = useState<any>({});

  const [ selected, setSelected ] = useState<Project>()

  const [ filter, setFiler ] = useState<any>({})

  const [ direction, setDirection ] = useState<"asc" | "desc" | undefined>('desc')
  const [ property, setProperty ] = useState<string>('displayId')

  const configuration = useTypeConfiguration('Project');

  const query = useQuery({
    suspense: false,
    staleWhileRevalidate: true
  })

  const projects = query.projects({})

  const history = useNavigate()

  const selectJob = (id: string) => {
    history(`${id}/tickets`)
  }

  const statusList = Array.from(new Set((projects || []).map((x: any) => x.status || '')))?.filter((a) => a != '');

  const [ createProject ] = useMutation((mutation, args: {
    displayId?: string, 
    name?: string, 
    description?: string,
    status?: string,
    startDate?: Date,
    endDate?: Date,
  }) => {
    const item = mutation.createProject({
      input: {
        id: args.displayId,
        name: args.name,
        description: args.description,
        startDate: args.startDate?.toISOString(),
        endDate: args.endDate?.toISOString(),
        status: args.status
      }
    })
    return {
      item: {
        ...item
      }
    }
  }, {
    awaitRefetchQueries: true,
    refetchQueries: [query.projects({})]
  })

  const [ updateProject ] = useMutation((mutation, args: {
    id: string, 
    displayId?: string, 
    name?: string, 
    description?: string,
    status?: string,
    startDate?: Date,
    endDate?: Date,
  }) => {
    if(!args.id) return;
    const item = mutation.updateProject({
      id: args.id,
      input: {
        id: args.displayId,
        name: args.name,
        description: args.description, 
        startDate: args.startDate?.toISOString(),
        endDate: args.endDate?.toISOString(),
        status: args.status
      }
    })
    return {
      item: { 
        ...item
      }
    }
  }, {
    awaitRefetchQueries: true,
    refetchQueries: [query.projects({})]
  })

  const [ deleteProject ] = useMutation((mutation, args: {id: string}) => {
    if(!args.id) return;
    const item = mutation.deleteProject({
      id: args.id
    })
    return {
      item: {
        ...item
      }
    }
  }, {
    awaitRefetchQueries: true,
    refetchQueries: [query.projects({})]
  })

  const getJobs = () => {
    let items = projects?.map((x) => ({
      id: x?.id, 
      displayId: x?.displayId, 
      name: x?.name, 
      status: x?.status,
      description: x?.description,
      startDate: x?.startDate,
      endDate: x?.endDate
    }))

    if(property && direction){
      items = items?.sort((first, last) => {
        let a : any = first;
        let b: any = last;
        return direction == 'asc' ? 
          a[property].localeCompare(b[property], undefined, {numeric: true}) :
          b[property].localeCompare(a[property], undefined, {numeric: true})
          // (a[property] == b[property] ? 0 : (a[property] > b[property] ? 1 : -1))
          // : (a[property] == b[property] ? 0 : (a[property] < b[property] ? 1 : -1))
      })
    }

    if(filter.status && filter.status != "All"){
      items = items?.filter((a) => a.status == filter.status)
    }

    if(filter.search){
      items = items?.filter((a) => {
        let name = a.name?.toLowerCase() || ''
        let id = a.displayId?.toLowerCase() || ''

        let search = filter.search.toLowerCase() || ''
        

        return name?.indexOf(search) > -1 || id?.indexOf(search) > -1 || `${id} ${name}`.indexOf(search) > -1
      }) 
    }

 
    return items
  }


    return (false) ? null : (
      <Box
        flex
        direction="column">

          <ProjectModal 
            selected={selected}
            error={modalError}
            statusList={statusList}
            onClose={() => {
              openModal(false)
              setSelected(undefined)
            }}
            onDelete={() => {
              deleteProject({args: {id: selected?.displayId}}).then(()=> {
                openModal(false)
                setSelected(undefined);
                // refetch()
              })
            }}
            onSubmit={(project) => {
              setModalError({});
              
              if(project.id){
                updateProject({args: {
                  id: project.displayId,
                  ...project
                }}).then(() => {
                  openModal(false);
                  setSelected(undefined)
                  // refetch();
                })
              }else{
                createProject({
                  args: project
                }).then(() => {
                  openModal(false);
                  setSelected(undefined)
                  // refetch();
                }).catch((err) => {
                  console.log({err})
                  if(err.message == "Duplicate job id"){
                      setModalError({displayId: project?.displayId})
                  }

                })
              }
            }}
            open={modalOpen} />
     
      <Header 
        onCreate={configuration?.create != false && (() => {
          console.log('create')
          openModal(true)
        })}
        statusList={statusList}
        filter={filter}
        onFilterChange={(filter) => setFiler(filter)}
        jobs={projects || []} />
        
      <Paper
        sx={{
          flex: 1,
          display: 'flex',
          marginTop: '3px'
        }} >

        <DataTable
          order={direction}
          orderBy={property}
          onSort={(_property) => {
            if(property == _property){
              setDirection(direction == 'asc' ? 'desc' : 'asc')
            }else{
              setProperty(_property)
              setDirection('asc')
            }
          }}
          columns={[
            {
              property: 'displayId',
              header: 'ID',
              size: 'xsmall',
              sortable: true
            },
            {
              property: 'name',
              header: 'Project name',
              width: '50%',
              sortable: true
            },
            {
              property: 'status',
              header: 'Status',
              sortable: true,
              size: 'small',
              align: 'center'
            }
          ]}
          onEditRow={(editProject) => {
            setSelected(editProject)
            openModal(true);
          }} 
          onClickRow={(datum) => datum.displayId && selectJob(datum?.displayId)}
          data={getJobs()} />
       {/* <SortedList 
          orderBy={"JobID"}
          keys={listKeys}
          data={}
       onClick={selectJob.bind(this)}/>*/}
      </Paper>
      </Box>

    );
  
}
