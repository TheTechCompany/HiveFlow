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
import { Add, ChevronLeft, ChevronRight, Close } from '@mui/icons-material'
import { Schedule } from '../../../components/Schedule';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import moment from 'moment';

const filter = createFilterOptions<{}>();

export const PeopleSingle = (props: any) => {
  const { id } = useParams();

  const [employees, setEmployees] = useState<any[]>([])
  const [contactDetails, setContactDetails] = useState<{ number: string, email: string }>({ number: '', email: '' })
  const [contactChanged, setContactChanged] = useState<boolean>(false);

  const [horizon, setHorizon] = useState<{ start: Date, end: Date }>({
    start: new Date(moment(new Date()).startOf('isoWeek').valueOf()),
    end: new Date(moment(new Date()).endOf('isoWeek').valueOf())
  })



  const { data } = useQuery(gql`
        query GetPeople ($id: ID, $start: DateTime, $end: DateTime){
           users(active: true, ids: [$id]) {
              id
              name

              leave {
                id
                start
                end
              }
           }

          calendarItems(where: {start_LTE: $end, end_GTE: $start}){
            id
            start
            end

            data
            groupBy
          }

          people:users(active: true){
            id
            name
          }

          projects {
            id
            displayId
            name
            colour
          }

          estimates {
            id

            displayId
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
      id,
      start: horizon.start,
      end: horizon.end
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

  const [assignLeave] = useMutation(gql`
    mutation AssignLeave ($id: ID, $start: DateTime, $end: DateTime) {
      assignLeave(id: $id, start: $start, end: $end){
        id
      }
    }  
  `, {
    refetchQueries: ['GetPeople']
  })

  const [updateLeave] = useMutation(gql`
    mutation AssignLeave ($id: ID, $leave: ID, $start: DateTime, $end: DateTime) {
      updateLeave(id: $id, leave: $leave, start: $start, end: $end){
        id
      }
    }  
  `, {
    refetchQueries: ['GetPeople']
  })



  const [removeLeave] = useMutation(gql`
    mutation RemoveLeave ($id: ID, $leave: ID) {
      removeLeave(id: $id, leave: $leave){
        id
      }
    }  
  `, {
    refetchQueries: ['GetPeople']
  })

  const person = data?.users?.[0];

  const leave = person?.leave?.length > 0 ? person.leave : [{}];

  const [skills, setSkills] = useState<any[]>([])

  useEffect(() => {
    setSkills(data?.skills || [])
  }, [data?.skills])



  const addDraftSkill = () => {
    setSkills((s) => s.concat([{}]))
  }

  const [skillValue, setSkillValue] = useState<any>(null)

  const [step, setStep] = useState('day');
  const [stepCount, setStepCount] = useState(7)

  const changeDir = (dir: number) => {

    return () => {
      let newStart = moment(horizon.start).add(stepCount * dir, step as any).toDate()
      let newEnd = moment(horizon.start).add((stepCount * dir) + stepCount, step as any).toDate()

      setHorizon?.({ start: newStart, end: newEnd })
    }
  }

  const rowOptions = data?.projects?.map((x) => ({...x, project: true})).concat(data?.estimates?.map((x) => ({...x, project: false})))

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
              console.log({ option })
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
                <Typography sx={{ width: '100%' }}>{skill.skill}</Typography>
                <IconButton onClick={() => deleteSkill?.({ variables: { id: skill.id } })}>
                  <Close />
                </IconButton>
                {/* <TextField onChange={(e) => createSkill({variables: {user: id, skill: e.target.value }})} size="small" /> */}
              </ListItem>
            ))}
          </List>
        </Box>
        <Paper sx={{ flex: 1, padding: '8px', flexDirection: 'column', gap: '8px', display: 'flex' }}>
          <Paper sx={{
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <IconButton onClick={changeDir(-1)}>
              <ChevronLeft />
            </IconButton>
            <Typography>
              {moment(horizon?.start).format('DD/MM/yyyy')} - {moment(horizon?.end).subtract(1, 'second').format('DD/MM/yyyy')}
            </Typography>
            <IconButton onClick={changeDir(1)}>
              <ChevronRight />
            </IconButton>
          </Paper>
          <Schedule
            horizon={horizon}
            renderItem={(item) => {
              if(item?.groupBy){
                let row = rowOptions?.find((a) => a.id == item?.groupBy?.id);
                const people = data?.people?.filter((a) => item?.data?.people?.indexOf(a.id) > -1)
                return (
                  <Paper>
                    <Box sx={{
                      padding: '4px',
                      background: row?.colour ? row?.colour : stringToColor(`${row.displayId} - ${row?.name}`) || 'green',
                      color: 'white'
                    }}>
                      <Typography>{row?.displayId} - {row?.name}</Typography>
                    </Box>
                    <Box sx={{padding: '8px'}}>
                      {people?.map((person) => (
                        <Typography>{person?.name}</Typography>
                      ))}
                    </Box>
                  </Paper>
                ) 
              }
              return <Paper elevation={2} sx={{ border: item.selected ? '1px solid blue' : undefined, background: 'red', flex: 1, height: '30px' }}></Paper>
            }}
            getRowGroup={(event) => {
              if(event?.groupBy){
                let row = rowOptions?.find((a) => a.id == event?.groupBy?.id);

                return row?.name
              }
              return 'Leave';
            }}
            createEvent={(event) => {
              assignLeave({
                variables: {
                  id: id,
                  start: event.start,
                  end: event.end
                }
              })
            }}
            updateEvent={(event) => {
              updateLeave({
                variables: {
                  id,
                  leave: event.id,
                  start: event.start,
                  end: event.end
                }
              })
            }}
            onDelete={(items) => {

              items.map((item_id) => {

                removeLeave({
                  variables: {
                    id,
                    leave: item_id
                  }
                })

              })
            }}
            events={leave.concat(data?.calendarItems?.filter((item) => item?.data?.people?.indexOf(id) > -1))}
          />
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
