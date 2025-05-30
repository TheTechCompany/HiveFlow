import React, { Component, useEffect } from 'react';
//import Schedule from '../../schedule';


// import StaffContactCard from '../../../components/primatives/staff-contact-card';
// import UploadableImage from '../../../components/primatives/uploadable-image';
// import EmployeeSchedule from '../../../components/employee-schedule';
// import utils from '../../../utils';
import { useState } from 'react';
import { stringToColor } from '@hexhive/utils';
import { Box, Divider, IconButton, List, ListItem, Paper, TextField, Typography } from '@mui/material';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router';
import { Add, Close } from '@mui/icons-material'
import { Timeline } from '@hexhive/ui';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions<{}>();

export const PeopleSingle = (props: any) => {
  const { id } = useParams();

  const [employees, setEmployees] = useState<any[]>([])
  const [contactDetails, setContactDetails] = useState<{ number: string, email: string }>({ number: '', email: '' })
  const [contactChanged, setContactChanged] = useState<boolean>(false);

  const { data } = useQuery(gql`
        query GetPeople ($id: ID){
           users(active: true, ids: [$id]) {
              id
              name
           }

          skills(user: $id){
            id
            skill
            skillData 
          }

          allSkills:skills{
            skill
          }

        }
     `, {
    variables: {
      id
    }
  })


  const [createSkill] = useMutation(gql`
    mutation CreateSkill ($user: String, $skill: String, $skillData: JSON){
      updateSkillAssignment(user: $user, skill: $skill, skillData: $skillData){
        id
      }
    }
    `, {
    refetchQueries: ['GetPeople']
  })

  const [deleteSkill] = useMutation(gql`
      mutation CreateSkill ($id: ID){
        deleteSkillAssignment(id: $id){
          id
        }
      }
      `, {
    refetchQueries: ['GetPeople']

  })
  
  const person = data?.users?.[0];

  const [skills, setSkills] = useState<any[]>([])

  useEffect(() => {
    setSkills(data?.skills || [])
  }, [data?.skills])

  console.log({ skills })
  // componentDidMount(){
  // }

  // componentWillMount(){
  //   utils.staff.getAll().then((res) => {
  //     this.setState({ employees : res});
  //   });
  // }


  // componentWillReceiveProps(newProps){
  //   if(this.props !== newProps){
  //     this.props = newProps;
  //     this.setState({
  //       ...newProps
  //     });
  //   }
  // }

  // updateDetails(key, value){
  //   let { contactDetails } = this.state;
  //   contactDetails[key] = value;
  //   this.setState({contactDetails: contactDetails, contactChanged: true})
  // }

  // pushDetails(){
  //   let id = this.props.match.params.employeeId;
  //   utils.staff.updateContact(id, this.state.contactDetails).then((r) => {
  //     console.log("Details update", r)
  //   })
  // }

  // render() {
  //   var id = this.props.match.params.employeeId;
  //   var employee = {} 
  //   for(var i = 0; i < this.state.employees.length; i++){
  //     if(this.state.employees[i].ID == id){
  //       employee = this.state.employees[i];
  //       break;
  //     }
  //   } 

  const addDraftSkill = () => {
    setSkills((s) => s.concat([{}]))
  }

  const [skillValue, setSkillValue] = useState<any>(null)

  return (
    <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="employee-view">
      <Box sx={{ padding: '8px' }}>
        <Typography>{person?.name}</Typography>
      </Box>
      <Divider />
      <Box sx={{
        padding: '8px',
        display: 'flex',
        flex: 1
      }}>
        <Box sx={{
          flexDirection: 'column',
          display: 'flex',
          minWidth: '200px'
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* <Typography>Skills</Typography> */}
            {/* <IconButton onClick={() => {
            addDraftSkill();
          }}>
            <Add />
          </IconButton> */}
          </Box>

          <Autocomplete
            value={skillValue}
            onChange={(event, newValue) => {
              if (typeof newValue === 'string') {
                // timeout to avoid instant validation of the dialog's form.
                setTimeout(() => {
                  createSkill({
                    variables: {
                      user: id,
                      skill: newValue
                    }
                  })
                });
                setSkillValue('')

              } else if (newValue && newValue.inputValue) {
                createSkill({
                  variables: {
                    user: id,
                    skill: newValue.inputValue
                  }
                })
                setSkillValue('')

              } else {
                setSkillValue(newValue);
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              if (params.inputValue !== '') {
                filtered.push({
                  inputValue: params.inputValue,
                  title: `Add "${params.inputValue}"`,
                });
              }

              return filtered;
            }}
            options={data?.allSkills || []}
            getOptionLabel={(option) => {
              // for example value selected with enter, right from the input
              if (typeof option === 'string') {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }

              return option.skill;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            renderOption={(props, option) => {
              console.log({option})
              const { key, ...optionProps } = props as any;
              return (
                <li key={key} {...optionProps}>
                  {option.title || option.skill}
                </li>
              );
            }}
            // sx={{ width: 300 }}
            freeSolo
            renderInput={(params) => <TextField {...params} label="Skill" size="small" />}
          />
          <List>
            {skills?.map((skill) => (
              <ListItem>
                <Typography sx={{width: '100%'}}>{skill.skill}</Typography>
                <IconButton onClick={() => deleteSkill?.({ variables: { id: skill.id } })}>
                  <Close />
                </IconButton>
                {/* <TextField onChange={(e) => createSkill({variables: {user: id, skill: e.target.value }})} size="small" /> */}
              </ListItem>
            ))}
          </List>
        </Box>
        <Paper sx={{ flex: 1, display: 'flex' }}>
          <Timeline />
        </Paper>
      </Box>
      {/* <div className="employee-top">



      </div>
      <Box className="employee-schedule">
        <div className="employee-schedule-view">

        </div>
      </Box> */}
    </Paper>
  );
}

/*
 <StaffContactCard
            name={employee.Name}
            id={this.props.match.params.employeeId} />
*/

//            <EmployeeSchedule employee={this.props.match.params.employeeId} />
