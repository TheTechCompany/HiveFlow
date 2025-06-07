import React, {
  Component, useMemo, useState
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
import { groupBy, head } from 'lodash';
import { ConfirmModal } from '../../modals/confirm';
import { useAPIData, useAPIFunctions } from './api';
import { AvatarList } from '@hexhive/ui';
import { useNavigate, useNavigation } from 'react-router';
import { Header } from './header';
import { SchedulerHeaderItem } from './schedule-components/header';
import { ScheduleRootProvider } from './context';
import { LeaveModal } from './leave-modal';
import { stringToColor } from '@hexhive/utils';
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


  const slowResult = useApollo(gql`
    query Slow{

      estimates {
        id
        displayId
        name


        tasks {
          id
          

          title

          startDate
          endDate


        }

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

  const { createCalendarItem, updateCalendarItem, deleteCalendarItem } = useAPIFunctions();
  const { calendarData } = useAPIData(horizon);

  const [headerHandle, setHeaderHandle] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const [tasks, setTasks] = useState<any[]>([]);

  const estimates = (slowData?.estimates || []).map((estimate) => {
    let tasks = estimate.tasks?.map((x) => ({ ...x, start: x.startDate, end: x.endDate }))

    return { ...estimate, draftSchedule: mergeDateRanges(tasks) };
  });;

  const projects = (slowData?.projects || []).map((project) => {
    let tasks = project.tasks.map((x) => ({ ...x, start: x.startDate, end: x.endDate }))

    return { ...project, draftSchedule: mergeDateRanges(tasks) };
  }); // query.projects({})?.map((x) => ({...x})) || [];

  const unscheduled = projects.filter((project) => {
    return project.tasks.length == 0 && calendarData?.calendarItems?.filter((item) => item.groupBy?.id == project.id)?.length == 0
  });

  const [unscheduledElem, setUnscheduleElem] = useState<any>(null)

  const rowOptions = projects.map((x) => ({ ...x, project: true })).concat(
    estimates.map((x) => ({ ...x, project: false }))
  )

  const [expanded, setExpanded] = useState<any>(rowOptions?.map((x, ix) => x.id) || []);

  const router = useNavigate()

  const people = calendarData?.users || []// query.people({})?.map((x) => ({...x})) || [];

  const allUsers = calendarData?.allUsers || [];

  const leave = people.map((person) => {
    return (person.leave || []).map((x) => ({ ...x, user: person.id }))
  }).reduce((prev, curr) => prev.concat(curr), [])


  // const mergedLeave = useMemo(() => {
  //   let outputLeave: any[] = [];
  //   // Sort by shortest duration first
  //   const shortestFirst = leave.sort((a, b) => {
  //     const aDuration = moment(a.end).diff(moment(a.start), 'minutes');
  //     const bDuration = moment(b.end).diff(moment(b.start), 'minutes');
  //     return aDuration - bDuration;
  //   });

  //   for (let i = 0; i < shortestFirst.length; i++) {
  //     const currentLeave = shortestFirst[i];
  //     let newRanges = [];

  //     for (let j = 0; j < outputLeave.length; j++) {
  //       const item = outputLeave[j];

  //       // If overlaps
  //       if (item.start < currentLeave.end && item.end > currentLeave.start) {
  //         const overlapStart = moment.max(moment(item.start), moment(currentLeave.start)).toISOString();
  //         const overlapEnd = moment.min(moment(item.end), moment(currentLeave.end)).toISOString();

  //         // Merge users into the overlapping range
  //         item.data = [...new Set([...(item.data || []), currentLeave.user])];

  //         // Add non-overlapping left segment
  //         if (moment(currentLeave.start).isBefore(overlapStart)) {
  //           newRanges.push({
  //             id: `leave-${moment(currentLeave.start).valueOf()}-${i}-left`,
  //             start: currentLeave.start,
  //             end: overlapStart,
  //             data: [currentLeave.user]
  //           });
  //         }

  //         // Add non-overlapping right segment
  //         if (moment(currentLeave.end).isAfter(overlapEnd)) {
  //           newRanges.push({
  //             id: `leave-${moment(currentLeave.end).valueOf()}-${i}-right`,
  //             start: overlapEnd,
  //             end: currentLeave.end,
  //             data: [currentLeave.user]
  //           });
  //         }

  //         // Mark as handled
  //         currentLeave._handled = true;
  //       }
  //     }

  //     // If there were no overlaps, just push the entire leave range
  //     if (!currentLeave._handled) {
  //       outputLeave.push({
  //         id: `leave-${moment(currentLeave.start).valueOf()}-${i}`,
  //         start: currentLeave.start,
  //         end: currentLeave.end,
  //         data: [currentLeave.user]
  //       });
  //     }

  //     // Push any new non-overlapping segments
  //     for (const r of newRanges) {
  //       outputLeave.push(r);
  //     }
  //   }

  //   return outputLeave;

  // }, [leave])

  const mergedLeave = useMemo(() => {
    const events = [];

  // Create entry and exit events
  for (const { start, end, user } of leave) {
    events.push({ time: new Date(start).getTime(), type: 'start', user });
    events.push({ time: new Date(end).getTime(), type: 'end', user });
  }

  // Sort by time, with 'end' events before 'start' at same timestamp
  events.sort((a, b) => 
    a.time - b.time || (a.type === 'end' ? -1 : 1)
  );

  const activeUsers = new Set();
  const result = [];
  let lastTime = null;

  for (const { time, type, user } of events) {
    if (lastTime !== null && time !== lastTime) {
      result.push({
        start: new Date(lastTime).toISOString(),
        end: new Date(time).toISOString(),
        data: [...activeUsers].sort(),
      });
    }

    // Modify active set after recording the segment
    if (type === 'start') {
      activeUsers.add(user);
    } else {
      activeUsers.delete(user);
    }

    lastTime = time;
  }

  return result.filter(r => r.data.length); // Remove empty ranges
  }, [leave])

  // const mergedLeave = useMemo(() => {

  //   let outputLeave = [];

  //   //Get shortest leave ranges
  //   const shortestFirst = leave.sort((a, b) => {
  //     return moment(a.end).diff(moment(a.start), 'minutes') > moment(b.end).diff(moment(b.end));
  //   })

  //   for(var i = 0; i < shortestFirst.length; i++){
  //     let currentLeave = shortestFirst[i];

  //     let created = [];

  //     //Find any existing ranges that have overlap
  //     outputLeave.forEach((item, ix) => {
  //       console.log("OUTPUT", {item, currentLeave}, item.start < currentLeave.end, item.end > currentLeave.start)
  //       if(item.start < currentLeave.end && item.end > currentLeave.start){

  //         //Keep track of ranges created
  //         created.push({
  //           start: item.start,
  //           end: item.end
  //         })

  //         //Add to their people list
  //         outputLeave[ix].data?.push(currentLeave.user)
  //       }
  //     })

  //     //Get ranges left after subtracting currentLeave
  //     let rangesRemaining = [];
  //     created.forEach((range, ix) => {
  //       rangesRemaining.push({
  //         start: (created[ix - 1]?.end || currentLeave.start),
  //         end: (range.start)
  //       })
  //     })
  //     rangesRemaining.push({
  //       start: (created[created.length - 1]?.end || currentLeave.start),
  //       end: created[created.length - 1]?.end > currentLeave?.end ? currentLeave?.end : created[created.length - 1]?.end
  //     })


  //     console.log({rangesRemaining, created})

  //     //Create remaining ranges
  //     rangesRemaining.map((range) => {
  //       outputLeave.push({
  //         id: `leave-${new Date(currentLeave?.start)?.getTime()}`, 
  //         start: currentLeave.start, 
  //         end: currentLeave.end, data: [currentLeave.user]
  //       })
  //     })

  //     // if(ix < 0){
  //     //   outputLeave.push({id: `leave-${new Date(currentLeave?.start)?.getTime()}`, start: currentLeave.start, end: currentLeave.end, data: [currentLeave.user]})
  //     // }else{
  //     //   outputLeave[ix].data?.push(currentLeave.user)
  //     // }
  //   }
  //   return outputLeave;
  // }, [leave]);


  const [confirmCallback, setConfirmCallback] = useState<any>(null);

  const raiseConfirm = (message: string, cb: any) => {
    setConfirmCallback({ message, cb });
  }

  const [headerCapacity, setHeaderCapacity] = useState<any>({});

  useEffect(() => {
    if (moment(horizon.end).diff(moment(horizon.start), 'days') < 10) {
      setExpanded(rowOptions.map((x, ix) => x.id).concat(['on-leave']))
    } else {
      setExpanded([])
    }
  }, [JSON.stringify(rowOptions), JSON.stringify(mergedLeave), JSON.stringify(horizon)])

  const [graphType, setGraphType] = useState<any>('Capacity');

  const [leaveOpen, openLeave] = useState(false);

  console.log(JSON.stringify(leave))

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }} className="schedule-container">

      <ScheduleRootProvider value={{
        events: calendarData?.calendarItems || [],
        rowOptions,
        people: people,
        leave,
        horizon,
        graphType
      }}>
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

        <LeaveModal
          open={leaveOpen}
          onClose={() => openLeave(false)}
        />
        <SchedulingModal
          open={modalOpen}
          selected={selected}
          projects={projects}
          estimates={estimates}
          people={people}
          tasks={tasks}
          onDelete={() => {
            deleteCalendarItem({
              variables: {
                id: selected?.id
              }
            }).then(() => {

              openModal(false)
              setModalDate(undefined)
              setSelected(undefined)
            })
          }}
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

        <Header
          graphType={graphType}
          setGraphType={setGraphType}
          horizon={horizon}
          onHorizonChanged={(horizon) => {
            setHorizon(horizon)
          }} />

        <ScheduleView
          onSelectMenuItem={(item) => {
            let project = rowOptions?.find((a) => a.id == item?.id);

            if (project)
              router(`/${project?.project ? "projects" : "estimates"}/${project.displayId}/tickets`)
          }}
          createEvent={(event, autocreate) => {

            if (autocreate) {
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

            if (event.groupBy?.id == 'on-leave') {
              openLeave(true);
              return;
            }

            let tasks = rowOptions.reduce((prev, curr) => prev.concat(curr.tasks.map((task) => ({ ...task, startDate: new Date(task.startDate), endDate: new Date(task.endDate), project: curr }))), [])
            tasks = tasks.filter((task) => {
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
          horizon={horizon}
          onHorizonChanged={({ start, end }) => {
            setHorizon({ start, end })
            setHeaderCapacity({})
            client.refetchQueries({ include: ['CalendarItems', 'Slow'] })
          }}
          onDoubleClickEvent={(event) => {
            if (event.selectable != false) {

              let tasks = rowOptions.reduce((prev, curr) => prev.concat(curr.tasks.map((task) => ({ ...task, startDate: new Date(task.startDate), endDate: new Date(task.endDate), project: curr }))), [])
              tasks = tasks.filter((task) => {
                return task.endDate?.getTime() > new Date(event.start)?.getTime() && task.startDate?.getTime() < new Date(event.end)?.getTime();
              })
              tasks = tasks.filter((a) => a.project?.id == event?.groupBy?.id)

              setTasks(tasks);
              setSelected(event)
              openModal(true);
            }
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
          renderHeader={SchedulerHeaderItem}
          renderItem={(item) => {

            let project = rowOptions?.find((a) => a.id == item.groupBy?.id);

            let eventPeople = (item.data?.people || []).map((x) => {
              return allUsers?.find((a) => a.id == x)
            })

       
            return (
              <Paper
                elevation={3}
                style={{
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
                      display: item.expanded ? 'flex' : 'none',
                      flex: 1,
                      height: item.expanded ? '100%' : 0
                    }}>
                      {item.draft ? (
                        <div style={{
                          height: '100%',
                          width: '100%',
                          background: 'rgba(127, 127, 127, 0.8)'
                        }}></div>
                      ) : (
                        <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                          {project && <Box sx={{
                            background: ((project?.colour ? project.colour : stringToColor(`${project?.id} - ${project.name}`)) || 'rgb(127, 127, 0, 1)'),
                            color: 'white'
                          }}>
                            <Typography textAlign={'center'}>{project?.displayId}</Typography>
                          </Box>}
                          <Box sx={{
                            // padding: '8px',
                            display: 'flex',
                            flex: 1,
                            flexDirection: 'column',
                            // gap: '4px',
                            textAlign: 'center'
                          }}>
                            <Typography fontSize={'small'} fontWeight={"bold"}>{project?.name}</Typography>
                            {eventPeople.map((person) => (
                              <Typography fontSize={'small'}>{person?.name}</Typography>
                            ))}
                          </Box>
                          {(item.permissions?.length > 0 || item.createdBy) &&
                            <Box sx={{ padding: '8px' }}>
                              <AvatarList
                                size={20}
                                users={(item.permissions?.map((x) => x.user)?.concat(item.createdBy ? [item.createdBy] : [])).map((x) => ({...x, color: stringToColor(x.id)}))} />
                            </Box>
                          }
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
            if (event.groupBy?.id == 'on-leave') return 'On Leave';
            const group = rowOptions?.find((a) => a.id == event.groupBy?.id);
            return `${group?.displayId ? group?.displayId + ' - ' : ''}${group?.name}`;
          }}
          onDelete={(items) => {
            raiseConfirm(`You are about to delete ${items.length} item`, () => {

              Promise.all(items.map((item) => {
                deleteCalendarItem?.({ variables: { id: item } })
              }))

            });

          }}
          events={
            /*
              {
                id: '1',
                start: new Date(),
                end: moment(new Date()).add(1, 'day').toDate(),
                selectable: false,
                groupBy: {
                  id: 'on-leave',
                } 
              }
            */
          
              rowOptions.map((x) =>
                x.draftSchedule.map((sched, ix) => ({
                  ...sched,
                  id: `${x.name}-${ix}`,
                  draft: true,
                  selectable: false,
                  groupBy: { ...x }
                }))
              ).reduce((prev, curr) => prev.concat(curr), []).filter((x) => {
                return (x.start.getTime() < horizon.end.getTime()) && (x.end.getTime() > horizon.start.getTime())
              }).concat(
                (calendarData?.calendarItems || []).map((x) => ({
                  ...x
                }))
              )
            

          }
        />
      </ScheduleRootProvider>
    </Box>
  );

}
