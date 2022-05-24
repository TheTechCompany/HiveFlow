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

export interface ProjectListProps {
}

export const ProjectList : React.FC<ProjectListProps> = (props) => {
  
  const [ modalOpen, openModal ] = useState(false);
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
    history(`${id}`)
  }

  const [ createProject ] = useMutation((mutation, args: {name: string, status: string}) => {
    const item = mutation.createProject({
      input: {
        name: args.name,
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

  const [ updateProject ] = useMutation((mutation, args: {id: string, name: string, status: string}) => {
    if(!args.id) return;
    const item = mutation.updateProject({
      id: args.id,
      update: {
        name: args.name,
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
      item: item
    }
  }, {
    awaitRefetchQueries: true,
    refetchQueries: [query.projects({})]
  })

  const getJobs = () => {
    let items = projects?.map((x) => ({id: x?.id, displayId: x?.displayId, name: x?.name, status: x?.status}))

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
            onClose={() => {
              openModal(false)
              setSelected(undefined)
            }}
            onDelete={() => {
              deleteProject({args: {id: selected?.id}}).then(()=> {
                openModal(false)
                setSelected(undefined);
                // refetch()
              })
            }}
            onSubmit={(project) => {
              if(project.id){
                updateProject({args: {
                  id: project.id,
                  name: project.name,
                  status: project.status
                }}).then(() => {
                  openModal(false);
                  setSelected(undefined)
                  // refetch();
                })
              }else{
                createProject({
                  args: {
                    name: project.name,
                    status: project.status
                  }
                }).then(() => {
                  openModal(false);
                  setSelected(undefined)
                  // refetch();
                })
              }
            }}
            open={modalOpen} />
     
      <Header 
        onCreate={configuration?.create != false && (() => {
          console.log('create')
          openModal(true)
        })}
        filter={filter}
        onFilterChange={(filter) => setFiler(filter)}
        jobs={projects || []} />
        
      <Box 
        flex
        overflow={{vertical: 'auto'}}
        round="xsmall"
        background="neutral-1"
        className="jobs-page">

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
              size: 'large',
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
          onClickRow={(datum) => datum.displayId && selectJob(datum?.displayId)}
          data={getJobs()} />
       {/* <SortedList 
          orderBy={"JobID"}
          keys={listKeys}
          data={}
       onClick={selectJob.bind(this)}/>*/}
      </Box>
      </Box>

    );
  
}
