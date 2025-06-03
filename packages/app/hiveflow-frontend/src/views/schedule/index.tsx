import React, {
  Component, useState
} from 'react';
// import { ScheduleView } from '@hexhive/ui';
import { mutation, useRefetch, useMutation, useQuery, resolved } from '@hive-flow/api';
import moment from 'moment';
import { schedule as scheduleActions } from '../../actions'
import { useContext } from 'react';
import { AuthContext, useAuth } from '@hexhive/auth-ui';
import { useEffect } from 'react';
import { Menu, ChevronLeft as Previous, ChevronRight as Next, X } from '@mui/icons-material';
import { DraftPane } from './draft-pane';
import { useQuery as useApollo, useMutation as useApolloMutation, gql, useApolloClient } from '@apollo/client';
import { ScheduleItem, ScheduleModal } from '../../modals/schedule';
import { Schedule as ScheduleView } from '../../components/Schedule';
import { SchedulingModal } from './modal';
import { mergeDateRanges } from './utils';
import { Collapse, Typography, Button, Box, Paper, Popover, Menu as UIMenu, MenuItem } from '@mui/material';
import { head } from 'lodash';
import { ConfirmModal } from '../../modals/confirm';
export const Schedule: React.FC<any> = (props) => {

  //User
  const [modalOpen, openModal] = useState(false);
  const [modalDate, setModalDate] = useState<Date>();

  const [selected, setSelected] = useState<any>(null);

  const { activeUser } = useAuth() //{activeUser: {sub: '1'}}

  const client = useApolloClient();

  const [horizon, setHorizon] = useState<{ start: Date, end: Date }>({
    start: new Date(moment(new Date()).startOf('isoWeek').valueOf()),
    end: new Date(moment(new Date()).endOf('isoWeek').valueOf())
  })


  const query = useQuery({
    suspense: false,
    staleWhileRevalidate: false,

  })

  const slowResult = useApollo(gql`
    query Slow {
      users(active: true){
        id
        name
      }
      projects{
        id
        displayId
        name
        colour

        
        tasks {
          id

          title

          startDate
          endDate

          requiredSkills

        }
      }
      equipment {
        id
        name
      }
    }
  `)
  const slowData = slowResult.data;

  const { data } = useApollo(gql`
   query Q ($startDate: DateTime, $endDate: DateTime) {
     timelineItems (where: {timeline: "Project", startDate_LTE: $endDate, endDate_GTE: $startDate}){
       id
       project{
          id
          displayId
          colour
          name
       }

       estimate {
            id
            displayId
            name
       }
       data {
          item
          location
          quantity
       }
     }
    scheduleItems (where: {date_GTE: $startDate, date_LTE: $endDate} ) {
      id
      date
      
      canEdit

      people{
        id
        name
      }
      equipment{
        id
        name
      }
      project {
        id
        displayId
        name
      }
      notes
      owner {
        id
        name
      }
      managers {
        id
        name
      }

      createdAt
    }
   
  }
  `, {
    variables: {
      startDate: horizon?.start?.toISOString(),
      endDate: horizon?.end?.toISOString()
    }
  })

  const { data: calendarData } = useApollo(gql`
    query CalendarItems($startDate: DateTime, $endDate: DateTime){
      calendarItems (where: {start_LTE: $endDate, end_GTE: $startDate} ){
        id
        start
        end

        data
        groupBy
      }
    }  
  `, {
    variables: {
      startDate: horizon.start,
      endDate: horizon.end
    }
  })

  const refetchSchedule = () => {
    client.refetchQueries({
      include: ['Q', 'Slow']
    })
  }

  const [headerHandle, setHeaderHandle] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const [tasks, setTasks] = useState<any[]>([]);

  const draftSchedule = data?.timelineItems || []
  const schedule: any[] = data?.scheduleItems || []//query.scheduleItems({where: {date_GT: horizon.start?.toISOString(), date_LT: horizon.end?.toISOString()}})

  const projects = (slowData?.projects || []).map((project) => {
    let tasks = project.tasks.map((x) => ({ ...x, start: x.startDate, end: x.endDate }))

    return { ...project, draftSchedule: mergeDateRanges(tasks) };
  }); // query.projects({})?.map((x) => ({...x})) || [];

  const unscheduled = projects.filter((project) => {
    return project.tasks.length == 0 && calendarData?.calendarItems?.filter((item) => item.groupBy?.id == project.id)?.length == 0
  });

  const [unscheduledElem, setUnscheduleElem] = useState<any>(null)

  const [expanded, setExpanded] = useState<any>(projects?.map((x, ix) => x.id) || []);

  useEffect(() => {
    if (moment(horizon.end).diff(moment(horizon.start), 'days') < 10) {
      setExpanded(projects.map((x, ix) => x.id))
    } else {
      setExpanded([])
    }
  }, [JSON.stringify(projects), JSON.stringify(horizon)])

  const people = slowData?.users || []// query.people({})?.map((x) => ({...x})) || [];
  const equipment = slowData?.equipment || [] //query.equipment({})?.map((x) => ({...x})) || []

  const users = slowData?.hiveUsers || [] //query.hiveUsers({})?.map((x) => ({...x})) || []

  const [createCalendarItem] = useApolloMutation(gql`
    mutation CreateCalendarItem ($input: CalendarItemInput) {
      createCalendarItem(input: $input){
        id
      }
    }  
  `, {
    refetchQueries: ['CalendarItems']
  })

  const [updateCalendarItem] = useApolloMutation(gql`
    mutation UpdateCalendarItem ($id: ID, $input: CalendarItemInput) {
      updateCalendarItem(id: $id, input: $input){
        id
      }
    }  
  `, {
    refetchQueries: ['CalendarItems']
  })

  const [deleteCalendarItem] = useApolloMutation(gql`
    mutation UpdateCalendarItem ($id: ID) {
      deleteCalendarItem(id: $id){
        id
      }
    }  
  `, {
    refetchQueries: ['CalendarItems']
  })




  const [joinCard, joinInfo] = useMutation((mutation, args: { id: string }) => {
    if (!activeUser?.id) return;

    const result = mutation.joinScheduleItem({
      id: args.id
    })
    return {
      item: {
        ...result
      },
      error: null
    }
  }, {
    onCompleted(data) { },
    onError(error) { },
    refetchQueries: [],
    awaitRefetchQueries: true,
    suspense: false,
  })


  const [leaveCard, leaveInfo] = useMutation((mutation, args: { id: string }) => {
    if (!activeUser?.id) return;
    const result = mutation.leaveScheduleItem({
      id: args.id
    })
    return {
      item: { ...result },
      error: null
    }
  }, {
    onCompleted(data) { },
    onError(error) { },
    refetchQueries: [],
    awaitRefetchQueries: true,
    suspense: false,
  })

  const [cloneItem, cloenInfo] = useMutation((mutation, args: { id: string, dates: Date[] }) => {

    const items = mutation.cloneScheduleItem({
      id: args.id,
      dates: args.dates.map((x) => x.toISOString())
    })

    return {
      item: [...items]
    }
  }, {
    onCompleted(data) { },
    onError(error) { },
    refetchQueries: [],
    awaitRefetchQueries: true,
    suspense: false,
  })

  const [confirmCallback, setConfirmCallback] = useState<any>(null);

  const raiseConfirm = (message: string, cb: any) => {
    setConfirmCallback({message, cb});
  }

  const [headerCapacity, setHeaderCapacity] = useState<any>({});

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
      }} className="schedule-container">

      {/* <DraftPane  
            open={draftsOpen}
            drafts={draftSchedule}
            projects={projects} /> */}
      <ConfirmModal
        open={confirmCallback != null}
        message={confirmCallback?.message}
        onConfirm={() => {
          confirmCallback?.cb?.();
          setConfirmCallback(null);
        }}
        onReject={() => {
          setConfirmCallback(null)
        }} />
      <SchedulingModal
        open={modalOpen}
        selected={selected}
        projects={projects}
        people={people}
        tasks={tasks}
        onSubmit={(schedule) => {
          let promise: any;

          if (!schedule.id) {

            promise = createCalendarItem({
              variables: {
                input: {
                  start: schedule.start,
                  end: schedule.end,
                  groupBy: schedule.groupBy,
                  data: {
                    people: schedule.people,
                    comments: schedule.comments,
                    tasks: schedule.tasks,
                  }
                }
              }
            })
          } else {
            promise = updateCalendarItem({
              variables: {
                id: schedule.id,
                input: {
                  start: schedule.start,
                  end: schedule.end,
                  groupBy: schedule.groupBy,
                  data: {
                    people: schedule.people,
                    comments: schedule.comments,
                    tasks: schedule.tasks,
                  }
                }
              }
            })
          }

          promise.then(() => {
            openModal(false)
            setModalDate(undefined)
            setSelected(undefined)
          })
        }}
        onClose={() => {
          openModal(false)
          setModalDate(undefined)
          setSelected(undefined)
        }}
      />

      <ScheduleView
        createEvent={(event, autocreate) => {

          if(autocreate){
            createCalendarItem({
              variables: {
                input: {
                  start: event.start,
                  end: event.end,
                  groupBy: event.groupBy,
                  data: {
                    people: event.data.people,
                    // comments: schedule.comments,
                    tasks: event.data.tasks,
                  }
                }
              }
            })
            return;
          }
          let tasks = projects.reduce((prev, curr) => prev.concat(curr.tasks.map((task) => ({ ...task, startDate: new Date(task.startDate), endDate: new Date(task.endDate), project: curr }))), [])
          tasks = tasks.filter((task) => {
            console.log(task.endDate?.getTime() > event.start?.getTime(), task.startDate?.getTime() < event.end?.getTime(), task, event)
            return task.endDate?.getTime() > event.start?.getTime() && task.startDate?.getTime() < event.end?.getTime();
            // return task.start.getTime() < event.start.getTime() && task.end.getTime() > event.end.getTime()
          })
          if (event?.groupBy) {
            tasks = tasks.filter((a) => a.project?.id == event?.groupBy?.id)
          }

          setModalDate(event.start)
          setTasks(tasks);
          setSelected(event);
          openModal(true);
          // }
        }}
        updateEvent={(event) => {
          console.log("Update", { event })
          updateCalendarItem({
            variables: {
              id: event.id,
              input: {
                start: event.start,
                end: event.end
              }
            }
          })

        }}
        horizon={horizon.start}
        onHorizonChanged={(start, end) => {
          setHorizon({ start, end })
          setHeaderCapacity({})
          client.refetchQueries({ include: ['CalendarItems', 'Slow'] })
        }}
        onDoubleClickEvent={(event) => {
          let tasks = projects.reduce((prev, curr) => prev.concat(curr.tasks.map((task) => ({ ...task, startDate: new Date(task.startDate), endDate: new Date(task.endDate), project: curr }))), [])
          tasks = tasks.filter((task) => {
            return task.endDate?.getTime() > new Date(event.start)?.getTime() && task.startDate?.getTime() < new Date(event.end)?.getTime();
          })
          tasks = tasks.filter((a) => a.project?.id == event?.groupBy?.id)

          setTasks(tasks);
          setSelected(event)
          openModal(true);
        }}
        expanded={expanded}
        sidebarHeader={(
          <>
            <UIMenu
              onClose={() => setUnscheduleElem(null)}
              open={Boolean(unscheduledElem)}
              anchorEl={unscheduledElem}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
              {unscheduled.map((item) =>
                <MenuItem dense>{item.displayId} - {item.name}</MenuItem>
              )}
            </UIMenu>
            <Button
              onClick={(event) => setUnscheduleElem(event.currentTarget)}
              fullWidth
              style={{ textTransform: 'none', height: '100%', textAlign: 'center' }}>
              <div>{unscheduled.length} unscheduled</div>

            </Button>
          </>)}
        renderHeader={(header) => {

          const scheduled = calendarData?.calendarItems?.filter((item) => {
            return new Date(item.start)?.getTime() < header.end?.getTime() && new Date(item.end) > header.start?.getTime();
          }).length

          let project_options = projects.filter((project) => {
            return project.tasks.filter((task) => {
              return new Date(task.endDate)?.getTime() > header.start?.getTime() && new Date(task.startDate)?.getTime() < header.end?.getTime();
            }).length > 0;
          }).length;

          if (headerCapacity[header.start + '-' + header.end]?.scheduled != scheduled ||
            headerCapacity[header.start + '-' + header.end]?.project_options != project_options
          ) {
            setHeaderCapacity({
              ...headerCapacity,
              [header.start + '-' + header.end]: {
                scheduled,
                project_options
              }
            })
          }

          const max_scheduled = Math.max(...Object.keys(headerCapacity).map((x) => headerCapacity[x]?.scheduled));
          const max_project_options = Math.max(...Object.keys(headerCapacity).map((x) => headerCapacity[x]?.project_options));
          const max = Math.max(max_scheduled, max_project_options)

          // projects.filter((prev, curr) => {
          //   prev.concat(curr.tasks.map((task) => ({ ...task, startDate: new Date(task.startDate), endDate: new Date(task.endDate), project: curr }))), [])
          // tasks = tasks.filter((task) => {
          //   return task.endDate?.getTime() > header.start?.getTime() && task.startDate?.getTime() < header.end?.getTime();
          // })

          const scheduledAmount = scheduled / max;
          const projectAmount = project_options / max;

          return (
            <div>
              <div style={{
                height: headerHeight,
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                position: 'relative',
              }}>

                {(!isNaN(scheduledAmount) && !isNaN(projectAmount)) && <>
                  <div style={{
                    position: 'absolute',
                    width: '50%',
                    height: (scheduledAmount * 100) + '%',
                    bottom: 0,
                    borderTopRightRadius: '12px',
                    borderTopLeftRadius: '12px',
                    background: 'rgba(0, 127, 0, 1)',
                    zIndex: scheduledAmount > projectAmount ? 1 : 2
                  }} />
                  <div style={{
                    position: 'absolute',
                    width: '50%',
                    height: (projectAmount * 100) + '%',
                    bottom: 0,
                    borderTopRightRadius: '12px',
                    borderTopLeftRadius: '12px',
                    background: '#dfdfdf',
                    zIndex: projectAmount > scheduledAmount ? 1 : 2

                  }} />
                </>
                }
                {/* header */}
              </div>
              <Box
                onMouseEnter={() => {
                  setHeaderHandle(true)
                }}
                onMouseLeave={() => {
                  setHeaderHandle(false)
                }}
                onMouseDown={(e: any) => {
                  let startY = e.clientY;

                  e.currentTarget.setPointerCapture(e.pointerId)

                  const move = (e: any) => {
                    let diff = e.clientY - startY;
                    console.log({ headerHeight, diff })

                    if (headerHeight + diff > 0) {
                      if (headerHeight + diff < 10) {
                        setHeaderHeight(0)
                      } else {
                        setHeaderHeight(headerHeight + diff);
                      }
                    }
                  }

                  const up = (e: any) => {
                    let diff = e.clientY - startY;
                    if (headerHeight + diff > 0) {
                      if (headerHeight + diff < 10) {
                        setHeaderHeight(0)
                      } else {
                        setHeaderHeight(headerHeight + diff);
                      }
                    }

                    e.currentTarget.releasePointerCapture(e.pointerId)

                    e.currentTarget.removeEventListener('mousemove', move)
                    e.currentTarget.removeEventListener('mouseup', up)
                  }

                  e.currentTarget.addEventListener('mousemove', move)
                  e.currentTarget.addEventListener('mouseup', up)

                }}
                style={{
                  background: headerHandle ? 'blue' : 'transparent',
                  height: '2px',
                  cursor: 'ns-resize',
                  width: '100%'
                }}></Box>
            </div>
          )
        }}
        renderItem={(item) => {

          let project = projects?.find((a) => a.id == item.groupBy?.id);

          let eventPeople = (item.data?.people || []).map((x) => {
            return people?.find((a) => a.id == x)
          })

          return (
            <Paper style={{
              marginTop: '4px',
              marginBottom: '4px',
              flex: 1,
              // height: item.draft ? '80%' : undefined,
              borderRadius: '12px',
              boxShadow: item.selected ? '0px 0px 0px 2px blue' : '0px 0px 0px 2px transparent',
              zIndex: item.draft ? 0 : 99,
              // background: '#FFF8F2',
              overflow: 'hidden'
            }}>
              {
                (item.expanded) ?
                  <Box sx={{
                    display: item.expanded ? undefined : 'none',
                    height: item.expanded ? '100%' : 0
                  }}>
                    {item.draft ? (
                      <div style={{
                        height: '100%',
                        background: 'rgba(127, 127, 127, 0.4)'
                      }}></div>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{
                          background: (project?.colour || 'rgb(127, 127, 0, 1)'),
                          color: 'white'
                        }}>
                          <Typography textAlign={'center'}>{project?.displayId} - {project?.name}</Typography>
                        </Box>
                        <Box sx={{
                          padding: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}>
                          {eventPeople.map((person) => (
                            <Typography>{person?.name}</Typography>
                          ))}
                        </Box>

                      </Box>
                    )}
                  </Box> : <div style={{
                    height: '30px',
                    background: item?.draft ? 'rgba(127, 127, 127, 0.4)' : (project?.colour || 'rgb(127, 127, 0, 1)')
                  }} />}
            </Paper>
          )
        }}
        getRowGroup={(event) => {
          const group = projects?.find((a) => a.id == event.groupBy?.id);
          return `${group?.displayId} - ${group?.name}`;
        }}
        onDelete={(items) => {
          raiseConfirm(`You are about to delete ${items.length} item`, () => {

            Promise.all(items.map((item) => {
              deleteCalendarItem?.({ variables: { id: item } })
            }))

           });

        }}
        events={
          projects.map((x) =>
            x.draftSchedule.map((sched, ix) => ({ ...sched, id: `${x.name}-${ix}`, draft: true, groupBy: { ...x } }))
          ).reduce((prev, curr) => prev.concat(curr), []).filter((x) => {
            return (x.start.getTime() < horizon.end.getTime()) && (x.end.getTime() > horizon.start.getTime())
          }).concat(
            (calendarData?.calendarItems || []).map((x) => ({
              ...x
            }))
          )

        }
      />

    </Box>
  );

}
