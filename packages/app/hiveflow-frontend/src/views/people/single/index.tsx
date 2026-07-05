import React, { Component, useEffect } from 'react';

import { useState, useMemo } from 'react';
import { stringToColor } from '@hexhive/utils';
import { Box, Divider, IconButton, List, ListItem, Paper, TextField, Typography } from '@mui/material';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router';
import { Add, ChevronLeft, ChevronRight, Close } from '@mui/icons-material'
import { Timeline } from '@hive-flow/ui';
import type { TimelineItem, TimelineGroup, TimelineStep, ItemChange } from '@hive-flow/ui';
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

              leave (where: {start_LTE: $end, end_GTE: $start}){
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

  const allLeave = person?.leave?.length > 0 ? person.leave?.filter((item: any) => {
    return new Date(item.start) < horizon.end && new Date(item.end) > horizon.start
  }) : []

  const leave = allLeave?.length > 0 ? allLeave.map((x: any) => ({ ...x, groupBy: { id: 'on-leave' } })) : [{ groupBy: { id: 'on-leave' } }];

  const [skills, setSkills] = useState<any[]>([])

  useEffect(() => {
    setSkills(data?.skills || [])
  }, [data?.skills])

  const addDraftSkill = () => {
    setSkills((s) => s.concat([{}]))
  }

  const [skillValue, setSkillValue] = useState<any>(null)

  const stepCount = 7

  const changeDir = (dir: number) => {
    return () => {
      let newStart = moment(horizon.start).add(stepCount * dir, 'day' as any).toDate()
      let newEnd = moment(horizon.start).add((stepCount * dir) + stepCount, 'day' as any).toDate()

      setHorizon?.({ start: newStart, end: newEnd })
    }
  }

  const rowOptions = data?.projects?.map((x: any) => ({ ...x, project: true })).concat(data?.estimates?.map((x: any) => ({ ...x, project: false })))

  // ── Derive step from horizon range (same logic as custom Schedule) ──
  const step: TimelineStep = useMemo(() => {
    const s = moment(horizon.start)
    const e = moment(horizon.end)
    if (e.diff(s, 'days') < 2) return 'hour';
    if (e.diff(s, 'week') < 2) return 'day';
    if (e.diff(s, 'months') < 6) return 'month';
    return 'year';
  }, [horizon])

  // ── Group helper (replaces getRowGroup) ─────────────────────────
  const getGroupId = (event: any): string => {
    if (event?.groupBy?.id == 'on-leave') return 'Leave';
    if (event?.groupBy) {
      const row = rowOptions?.find((a: any) => a.id == event?.groupBy?.id);
      if (row) return row.displayId + ' - ' + row?.name;
    }
    return String(event?.groupBy?.id ?? 'unknown');
  }

  // ── Timeline data ───────────────────────────────────────────────
  const calendarForPerson = (data?.calendarItems || []).filter((item: any) =>
    item?.data?.people?.indexOf(id) > -1
  )

  const timelineItems: TimelineItem[] = useMemo(() => {
    const events = leave.concat(calendarForPerson)
    return events.map((event: any) => ({
      id: event.id || `empty-${Math.random()}`,
      start: new Date(event.start || horizon.start),
      end: new Date(event.end || horizon.end),
      groupId: getGroupId(event),
      data: event,
    }))
  }, [leave, calendarForPerson, horizon, rowOptions])

  const timelineGroups: TimelineGroup[] = useMemo(() => {
    const ids = [...new Set(timelineItems.map((item) => item.groupId))]
    // Sort: Leave always first, then alphabetically
    return ids
      .sort((a, b) => {
        if (a === 'Leave') return -1;
        if (b === 'Leave') return 1;
        return (a ?? '').localeCompare(b ?? '');
      })
      .map((gid) => ({ id: gid, label: gid }))
  }, [timelineItems])

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
          </Box>

          <Autocomplete
            value={skillValue}
            onChange={(event, newValue) => {
              if (typeof newValue === 'string') {
                setTimeout(() => {
                  createSkill({
                    variables: {
                      user: id,
                      skill: newValue
                    }
                  })
                });
                setSkillValue('')

              } else if (newValue && (newValue as any).inputValue) {
                createSkill({
                  variables: {
                    user: id,
                    skill: (newValue as any).inputValue
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
              if (typeof option === 'string') {
                return option;
              }
              if ((option as any).inputValue) {
                return (option as any).inputValue;
              }

              return option.skill;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            renderOption={(props, option) => {
              const { key, ...optionProps } = props as any;
              return (
                <li key={key} {...optionProps}>
                  {(option as any).title || option.skill}
                </li>
              );
            }}
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
          <Timeline
            items={timelineItems}
            groups={timelineGroups}
            start={horizon.start}
            end={horizon.end}
            step={step}
            stepCount={stepCount}
            sidebarWidth={220}
            itemHeight={40}
            callbacks={{
              onItemCreate: (start: Date, end: Date, groupId?: string) => {
                if (groupId === 'Leave') {
                  assignLeave({
                    variables: {
                      id,
                      start,
                      end
                    }
                  })
                }
              },
              onItemChange: (change: ItemChange) => {
                const leaveIds = leave.map((x: any) => x.id)
                if (change.id && leaveIds.indexOf(change.id) > -1) {
                  updateLeave({
                    variables: {
                      id,
                      leave: change.id,
                      start: change.start,
                      end: change.end
                    }
                  })
                }
              },
              onDelete: (itemIds: string[]) => {
                itemIds.forEach((itemId) => {
                  removeLeave({
                    variables: {
                      id,
                      leave: itemId
                    }
                  })
                })
              },
            }}
            renderers={{
              renderItem: (item: TimelineItem) => {
                const event = item.data as any;
                if (event?.groupBy?.id == 'on-leave') {
                  return <Paper elevation={2} sx={{ border: 'none', background: 'red', flex: 1, height: '30px', marginTop: '4px', marginBottom: '4px' }}></Paper>
                }
                if (event?.groupBy) {
                  const row = rowOptions?.find((a: any) => a.id == event?.groupBy?.id);
                  const people = data?.people?.filter((a: any) => event?.data?.people?.indexOf(a.id) > -1)
                  return (
                    <Box sx={{
                      width: '100%',
                      height: '100%',
                    }}>
                      <Paper sx={{
                        marginTop: '4px',
                        marginBottom: '4px',
                      }}>
                        <Box sx={{
                          textAlign: 'center',
                          background: row?.colour ? row?.colour : stringToColor(`${row?.id} - ${row?.name}`) || 'green',
                          color: 'white'
                        }}>
                          <Typography fontSize={'small'}>{row?.displayId}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography fontSize={'small'} fontWeight={"bold"}>{row?.name}</Typography>
                          {people?.map((person: any) => (
                            <Typography fontSize={'small'}>{person?.name}</Typography>
                          ))}
                        </Box>
                      </Paper>
                    </Box>
                  )
                }
                return null;
              },
            }}
          />
        </Paper>
      </Box>
    </Paper>
  );
}
