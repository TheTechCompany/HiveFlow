import React, { Component, useState } from 'react';

import { Box, Text, TextInput } from 'grommet'

import { DataTable } from '../../../components/DataTable'

import {
   Search as IoSearch
} from 'grommet-icons'
import { StaffSearchHeader } from './header';
import { client, useMutation } from '@hive-flow/api';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import { idText } from 'typescript';
import { useTypeConfiguration } from '../../../context';
import { PeopleModal, Person } from '../../../modals/people';
import { Paper } from '@mui/material';
import { useNavigate } from 'react-router';

// import { }


export const PeopleList: React.FC<any> = (props) => {
   // const [employees, setEmployees] = useState<any[]>([])

   const configuration = useTypeConfiguration('People');

   const [ modalOpen, openModal ] = useState(false);
   const [ selected, setSelected ] = useState<Person>();

   const [search, setSearch] = useState<string>('')



   const [direction, setDirection] = useState<"asc" | "desc" | undefined>('desc')
   const [property, setProperty] = useState<string>('name')


   const client = useApolloClient();

   const { data } = useQuery(gql`
      query GetPeople {
         users(active: true) {
            id
            name
         }

      }
   `)

   const people = data?.users || [];

   const refetch = () => {
      client.refetchQueries({include: ['GetPeople']})
   }

   const navigate = useNavigate();

  
   // componentWillMount(){
   //    utils.staff.getAll().then((res) => {
   //       this.setState({ employees : res});
   //    });
   // }

   const filterPeople = (item: any) => {
      if (search.length > 0) {
         return item.name.toLowerCase().includes(search.toLowerCase())
      }

      if(item.inactive){
         return false;
      }
      return true;
   }

   const sortPeople = (left: any, right: any) => {
      if (property && direction) {
         return (direction == 'asc' ?
            (left[property] == right[property] ? 0 : (left[property] > right[property] ? 1 : -1))
            : (left[property] == right[property] ? 0 : (left[property] < right[property] ? 1 : -1)))
      } else {
         return 0;
      }
   }

   return (

      <Box
         style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

         {/* <PeopleModal 
            open={modalOpen} 
            selected={selected}
            onDelete={() => {
               deletePeople({args: {id: selected?.id}}).then(()=> {
                  openModal(false)
                  setSelected(undefined);
                  refetch()
               })
            }}
            onSubmit={(project) => {
               if(project.id){
                  updatePeople({args: {
                     id: project.id,
                     name: project.name,
                  }}).then(() => {
                     openModal(false);
                     setSelected(undefined)
                     refetch();
                  })
               }else{
                  createPeople({
                     args: {
                        name: project.name,
                     }
                  }).then(() => {
                     openModal(false);
                     setSelected(undefined)
                     refetch();
                  })
               }
            }}
            onClose={() => {
               openModal(false)
               setSelected(undefined)
            }} /> */}
         <StaffSearchHeader
            // onCreate={configuration?.create != false && (() => {
            //    openModal(true);
            // })}
            filter={search}
            onFilterChange={(filter) => setSearch(filter)} />

         <Paper
               sx={{flex: 1, marginTop: '3px', display: 'flex'}}>

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
               onClickRow={(row) => {
                  navigate(row.id)
               }}
               columns={[
             
                  {
                     property: 'name',
                     header: "Name",
                     sortable: true
                  }
               ]}
               data={people.filter(filterPeople).sort(sortPeople)} />
         </Paper>
      </Box>

   );

}

// export default connect((state) => ({
//   token: state.auth.token
// }))(EmployeeList)
