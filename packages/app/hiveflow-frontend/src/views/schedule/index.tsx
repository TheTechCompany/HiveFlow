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
import { Timeline, type TimelineItem, type TimelineGroup, type TimelineStep, type ItemChange } from '@hive-flow/ui';
import { SchedulingModal } from './modal';
import { mergeDateRanges } from './utils';
import { Collapse, Typography, Button, Box, Paper, Popover, Menu as UIMenu, MenuItem } from '@mui/material';
import { groupBy, head } from 'lodash';
import { ConfirmModal } from '../../modals/confirm';
import { useAPIData, useAPIFunctions } from './api';
import { AvatarList } from '@hexhive/ui';
import { useNavigate, useNavigation } from 'react-router';
import { Header } from './header';
import { ScheduleRootProvider } from './context';
import { LeaveModal } from './leave-modal';
import { stringToColor } from '@hexhive/utils';
import zIndex from '@mui/material/styles/zIndex';
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

  const [tasks, setTasks] = useState<any[]>([]);

  const estimates = (slowData?.estimates || []).map((estimate) => {
    let tasks = (estimate.tasks || []).map((x) => ({ ...x, start: x.startDate, end: x.endDate }))

    return { ...estimate, draftSchedule: mergeDateRanges(tasks) };
  });;

  const projects = (slowData?.projects || []).map((project) => {
    let tasks = (project.tasks || []).map((x) => ({ ...x, start: x.startDate, end: x.endDate }))

    return { ...project, draftSchedule: mergeDateRanges(tasks) };
  }); // query.projects({})?.map((x) => ({...x})) || [];

  const rowOptions = projects.map((x) => ({ ...x, project: true })).concat(
    estimates.map((x) => ({ ...x, project: false }))
  )

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

  // ── Timeline step derived from horizon ──────────────────────────
  const step = useMemo((): TimelineStep => {
    const start = moment(horizon.start);
    const end = moment(horizon.end);
    if (end.diff(start, 'days') < 2) return 'hour';
    else if (end.diff(start, 'week') < 2) return 'day';
    else if (end.diff(start, 'months') < 6) return 'month';
    else return 'year';
  }, [horizon]);

  // ── Build timeline groups from rowOptions ───────────────────────
  const timelineGroups = useMemo((): TimelineGroup[] => {
    const groups: TimelineGroup[] = rowOptions.map((x) => ({
      id: x.id,
      label: `${x.displayId ? x.displayId + ' - ' : ''}${x.name}`,
    }));
    // Add On Leave group for leave items
    groups.push({ id: 'on-leave', label: 'On Leave' });
    return groups;
  }, [rowOptions]);

  // ── Build timeline items from events ────────────────────────────
  const timelineItems = useMemo((): TimelineItem[] => {
    // Draft schedule items (background layer)
    const drafts: TimelineItem[] = rowOptions.flatMap((x) =>
      (x.draftSchedule || []).map((sched, ix) => ({
        id: `draft-${x.id}-${ix}`,
        start: new Date(sched.start),
        end: new Date(sched.end),
        groupId: x.id,
        color: x.colour || stringToColor(`${x.id} - ${x.name}`),
        zIndex: 0,
        selectable: false,
        movable: false,
        resizable: false,
        data: {
          ...sched,
          groupBy: { ...x },
          zIndex: 0,
          selectable: false,
          draft: true,
        },
      }))
    ).filter((x) =>
      x.start.getTime() < horizon.end.getTime() &&
      x.end.getTime() > horizon.start.getTime()
    );

    // Real calendar items (foreground layer)
    const items: TimelineItem[] = (calendarData?.calendarItems || []).map((x) => {
      const project = rowOptions.find((a) => a.id === x.groupBy?.id);
      const groupId = x.groupBy?.id === 'on-leave' ? 'on-leave' : (x.groupBy?.id || 'unknown');
      return {
        id: x.id,
        start: new Date(x.start),
        end: new Date(x.end),
        groupId,
        color: project?.colour || stringToColor(`${x.groupBy?.id}`),
        zIndex: 1,
        selectable: x.selectable !== false,
        data: {
          ...x,
          zIndex: 1,
        },
      };
    });

    return [...drafts, ...items];
  }, [rowOptions, calendarData, horizon]);

  // ── Helper: find project by item ────────────────────────────────
  const getProjectForItem = (item: TimelineItem): any => {
    const data: any = item.data;
    const groupById = data?.groupBy?.id;
    if (!groupById || groupById === 'on-leave') return null;
    return rowOptions?.find((a) => a.id === groupById);
  };

  // ── Helper: open scheduling modal for an item ───────────────────
  const openModalForItem = (item: TimelineItem) => {
    const orig: any = item.data;
    if (orig?.selectable === false) return;
    if (orig?.groupBy?.id === 'on-leave') {
      openLeave(true);
      return;
    }
    let tasks = rowOptions.reduce((prev, curr) =>
      prev.concat((curr.tasks || []).map((task) => ({
        ...task,
        startDate: new Date(task.startDate),
        endDate: new Date(task.endDate),
        project: curr,
      }))), []);
    tasks = (tasks || []).filter((task: any) => {
      return task.endDate?.getTime() > new Date(orig?.start)?.getTime() &&
        task.startDate?.getTime() < new Date(orig?.end)?.getTime();
    });
    if (orig?.groupBy) {
      tasks = (tasks || []).filter((a: any) => a.project?.id == orig?.groupBy?.id);
    }
    setTasks(tasks);
    setSelected(orig);
    openModal(true);
  };

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

  const [graphType, setGraphType] = useState<any>('Capacity');

  const [leaveOpen, openLeave] = useState(false);

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

        <Timeline
          items={timelineItems}
          groups={timelineGroups}
          start={horizon.start}
          end={horizon.end}
          step={step}
          itemHeight={80}
          headerHeight={60}
          sidebarWidth={220}
          resizable={true}
          movable={true}
          showLinks={false}
          showToday={true}
          fitContainer
          callbacks={{
            onItemChange: (change: ItemChange) => {
              updateCalendarItem({
                variables: {
                  id: change.id,
                  input: {
                    ...(change.start ? { start: change.start } : {}),
                    ...(change.end ? { end: change.end } : {}),
                  }
                }
              });
            },
            onItemCreate: (start: Date, end: Date, groupId?: string) => {
              if (groupId === 'on-leave') {
                openLeave(true);
                return;
              }
              const project = rowOptions?.find((a: any) => a.id === groupId);
              let tasks: any[] = rowOptions.reduce((prev: any[], curr: any) =>
                prev.concat((curr.tasks || []).map((task: any) => ({
                  ...task,
                  startDate: new Date(task.startDate),
                  endDate: new Date(task.endDate),
                  project: curr,
                }))), []);
              tasks = (tasks || []).filter((task: any) => {
                return task.endDate?.getTime() > start.getTime() &&
                  task.startDate?.getTime() < end.getTime();
              });
              if (groupId) {
                tasks = (tasks || []).filter((a: any) => a.project?.id == groupId);
              }
              const event = {
                start,
                end,
                groupBy: project ? { id: project.id, displayId: project.displayId, name: project.name } : undefined,
                data: { people: [], tasks: [] },
              };
              setModalDate(start);
              setTasks(tasks);
              setSelected(event);
              openModal(true);
            },
            onHorizonChange: (start: Date, end: Date) => {
              setHorizon({ start, end });
              client.refetchQueries({ include: ['CalendarItems', 'Slow'] });
            },
            onNavigate: (direction: 'prev' | 'next' | 'today') => {
              const span = moment(horizon.end).diff(moment(horizon.start), 'milliseconds');
              let newStart: Date;
              switch (direction) {
                case 'prev':
                  newStart = moment(horizon.start).subtract(span, 'milliseconds').toDate();
                  break;
                case 'next':
                  newStart = moment(horizon.start).add(span, 'milliseconds').toDate();
                  break;
                case 'today':
                  newStart = moment().startOf('isoWeek').toDate();
                  break;
              }
              const newEnd = moment(newStart).add(span, 'milliseconds').toDate();
              setHorizon({ start: newStart, end: newEnd });
              client.refetchQueries({ include: ['CalendarItems', 'Slow'] });
            },
            onItemDoubleClick: (itemId: string) => {
              const item = timelineItems.find((i) => i.id === itemId);
              if (item) openModalForItem(item);
            },
            onDelete: (itemIds: string[]) => {
              raiseConfirm(`You are about to delete ${itemIds.length} item`, () => {
                Promise.all(itemIds.map((id) =>
                  deleteCalendarItem?.({ variables: { id } })
                ));
              });
            },
          }}
          renderers={{
            renderItem: (item: TimelineItem) => {
              const project = getProjectForItem(item);
              const eventData: any = item.data;
              const eventPeople = (eventData?.data?.people || []).map((x: string) => {
                return allUsers?.find((a: any) => a.id == x);
              });

              const isDraft = eventData?.zIndex === 0;
              const projectColor = project?.colour
                ? project.colour
                : stringToColor(`${project?.id} - ${project?.name}`);

              return (
                <Paper
                  elevation={isDraft ? 0 : 3}
                  style={{
                    flex: 1,
                    height: '100%',
                    borderRadius: '12px',
                    boxShadow: isDraft
                      ? 'none'
                      : `0px 0px 0px 2px ${projectColor || 'rgb(127, 127, 0, 1)'}`,
                    overflow: 'hidden',
                    background: isDraft ? 'rgba(186, 186, 186, 0.8)' : undefined,
                  }}
                >
                  {isDraft ? (
                    <div style={{
                      height: '100%',
                      width: '100%',
                      background: 'rgba(186, 186, 186, 0.8)',
                    }} />
                  ) : (
                    <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', height: '100%' }}>
                      {project && (
                        <Box sx={{
                          background: projectColor || 'rgb(127, 127, 0, 1)',
                          color: 'white',
                        }}>
                          <Typography fontSize={'small'} textAlign={'center'}>
                            {project?.displayId}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'column',
                        textAlign: 'center',
                        justifyContent: 'center',
                      }}>
                        <Typography fontSize={'small'} fontWeight={"bold"}>
                          {project?.name}
                        </Typography>
                        {eventPeople.map((person: any) => (
                          <Typography fontSize={'small'} key={person?.id}>
                            {person?.name}
                          </Typography>
                        ))}
                      </Box>
                      {(eventData?.permissions?.length > 0 || eventData?.createdBy) && (
                        <Box sx={{ padding: '4px' }}>
                          <AvatarList
                            size={16}
                            users={(eventData.permissions?.map((x: any) => x.user)
                              ?.concat(eventData.createdBy ? [eventData.createdBy] : []))
                              .map((x: any) => ({ ...x, color: stringToColor(x.id) }))}
                          />
                        </Box>
                      )}
                    </Box>
                  )}
                </Paper>
              );
            },
            renderGroupHeader: (group: TimelineGroup, _expanded: boolean) => (
              <Typography
                fontSize={'small'}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
                onClick={() => {
                  const project = rowOptions?.find((a: any) => a.id === group.id);
                  if (project && group.id !== 'on-leave') {
                    router(`/${project?.project ? "projects" : "estimates"}/${project.displayId}/timeline`);
                  }
                }}
              >
                {group.label}
              </Typography>
            ),
          }}
        />
      </ScheduleRootProvider>
    </Box>
  );

}
