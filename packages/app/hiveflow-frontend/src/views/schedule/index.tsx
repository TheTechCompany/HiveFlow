import React, {
  Component, useState
} from 'react';
import { Button, Collapsible } from 'grommet'
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
import { Collapse, Typography, Box } from '@mui/material';
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


  // const draftSchedule = query.timelineItems({ where: {timeline: "Projects", startDate_LTE: horizon.end?.toISOString(), endDate_GTE: horizon.start?.toISOString()} })?.map((x) => ({...x, project: x.project({}), items: x.items({})})) || [];

  // const [schedule, setSchedule] = useState<any[]>([])//?.map((x) => ({...x, project: x?.project})) || [];
  //query.ScheduleMany({startDate: horizon.start, endDate: horizon.end})

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
          title

          startDate
          endDate
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
    query CalendarItems{
      calendarItems {
        id
        start
        end

        data
        groupBy
      }
    }  
  `)

  const refetchSchedule = () => {
    client.refetchQueries({
      include: ['Q', 'Slow']
    })
  }

  

  const [ tasks, setTasks ] = useState<any[]>([]);

  const draftSchedule = data?.timelineItems || []
  const schedule: any[] = data?.scheduleItems || []//query.scheduleItems({where: {date_GT: horizon.start?.toISOString(), date_LT: horizon.end?.toISOString()}})

  const projects = (slowData?.projects || []).map((project) => {
    let tasks = project.tasks.map((x) => ({...x, start: x.startDate, end: x.endDate}))
    
    return {...project, draftSchedule: mergeDateRanges(tasks)};
  }); // query.projects({})?.map((x) => ({...x})) || [];

  const [ expanded, setExpanded ] = useState<any>(projects?.map((x, ix) => x.id) || []);

  useEffect(() => {
    console.log({horizon, date: moment(horizon.end).diff(moment(horizon.start), 'days')})
    if(moment(horizon.end).diff(moment(horizon.start), 'days') < 10){
      setExpanded(projects.map((x, ix) => x.id))
    }else{
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


  const [createItem, info] = useMutation((mutation, args: { item: any }) => {
    let query = {};

    if (!args.item.project) return { error: 'Project is required' }


    const result = mutation.createScheduleItem({
      input: {
        date: args.item.date,
        project: args.item.project,
        people: args.item.people,
        equipment: args.item.equipment,
        notes: args.item.notes,
      }
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

  const [updateItem, infoItem] = useMutation((mutation, args: { id: string, item: any }) => {


    // let oldScheduleItem = schedule.find((a) => a.id == args.id)

    // let add_people = args.item.people.filter((a: any) => oldScheduleItem.people.map((x: any) => x.id).indexOf(a.id) < 0)
    // let remove_people = oldScheduleItem.people.filter((a: any) => args.item.people.map((x: any) => x.id).indexOf(a.id) < 0)

    // let add_equipment = args.item.equipment.filter((a: any) => oldScheduleItem.equipment.map((x: any) => x.id).indexOf(a.id) < 0)
    // let remove_equipment = oldScheduleItem.equipment.filter((a: any) => args.item.equipment.map((x: any) => x.id).indexOf(a.id) < 0)


    let query: any = {

    };

    // if(args.item.project != oldScheduleItem.project.id) {
    //   query['project'] = args.item.project
    // }

    // if(args.item.notes) query.notes = args.item.notes;

    // if(add_people.length > 0){
    //   query = {
    //     ...query,
    //     people: {
    //       ...query.people,
    //       connect: [{where: {node: {id_IN: add_people.map((x: any) => x.id)}}}]
    //     }
    //   }
    // }


    // if(remove_people.length > 0){
    //   query = {
    //     ...query,
    //     people: {
    //       ...query.people,
    //       disconnect: [{where: {node: {id_IN: remove_people.map((x: any) => x.id)}}}]
    //     }
    //   }
    // }

    // if(add_equipment.length > 0){
    //   query = {
    //     ...query,
    //     equipment: {
    //       ...query.equipment,
    //       connect: [{where: {node: {id_IN: add_equipment.map((x: any) => x.id)}}}]
    //     }
    //   }
    // }


    // if(remove_equipment.length > 0){
    //   query = {
    //     ...query,
    //     equipment: {
    //       ...query.equipment,
    //       disconnect: [{where: {node: {id_IN: remove_equipment.map((x: any) => x.id)}}}]
    //     }
    //   }
    // }

    const result = mutation.updateScheduleItem({
      id: args.id, input: {
        ...args.item
      }
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

  const [removeItem, infoRemove] = useMutation((mutation, args: { id: string }) => {
    if (!args.id) return { error: "Item Id is required" }
    const result = mutation.deleteScheduleItem({ id: args.id })
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
    // let query : any = {};
    // if(args.item.notes) query.notes = args.item.notes;

    // if(args.item.people.length > 0){
    //   query = {
    //     ...query,
    //     people: {
    //       ...query.people,
    //       connect: [{where: {node: {id_IN: args.item.people.map((x: any) => x.id)}}}]
    //     }
    //   }
    // }

    // if(args.item.equipment.length > 0){
    //   query = {
    //     ...query,
    //     equipment: {
    //       ...query.equipment,
    //       connect: [{where: {node: {id_IN: args.item.equipment.map((x: any) => x.id)}}}]
    //     }
    //   }
    // }


    // const item = mutation.updateHiveOrganisations({
    //   update: {
    //     schedule: [{create: args.dates.map((date) => ({
    //       node: {
    //         date: date.toISOString(),
    //         project: {
    //           connect: {where: {node: {
    //             id: args.item.project
    //            }}}
    //         },
    //         ...query,
    //         owner: {
    //           connect: {where: {node: {id: activeUser?.id}}}
    //         }
    //       }
    //     }))}]
    //   }
    // })
    // // const result = mutation.cloneScheduleItem({id: args.id, cloneTo: args.dates})
    // return {
    //   item:  {
    //     ...item.hiveOrganisations[0]
    //   }, //result ||
    //   error: null
    // }
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


  const [draftsOpen, openDrafts] = useState<boolean>(false);


  return (
    <Box
      sx={{
        flex:1,
        display: 'flex'
      }} className="schedule-container">

      {/* <DraftPane  
            open={draftsOpen}
            drafts={draftSchedule}
            projects={projects} /> */}

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
        createEvent={(event) => {

          let tasks = projects.reduce((prev, curr) => prev.concat(curr.tasks.map((task) => ({...task, startDate: new Date(task.startDate), endDate: new Date(task.endDate), project: curr}))), [])
          tasks = tasks.filter((task) => {
            console.log( task.endDate?.getTime() > event.start?.getTime(), task.startDate?.getTime() < event.end?.getTime(), task, event)
            return task.endDate?.getTime() > event.start?.getTime() && task.startDate?.getTime() < event.end?.getTime();
            // return task.start.getTime() < event.start.getTime() && task.end.getTime() > event.end.getTime()
          })
          console.log({ event, tasks })
          // if(event?.groupBy){
          //   createCalendarItem({
          //     variables: {
          //       input: {
          //         start: event.start,
          //         end: event.end,
          //         groupBy: event.groupBy,
          //         data: {
          //         }
          //       }
          //     }
          //   })
          // }else{
            setModalDate(event.start)
            setTasks(tasks);
            setSelected(event);
            openModal(true);
          // }
        }}
        updateEvent={(event) => {
          console.log("Update", {event})
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
        }}
        onDoubleClickEvent={(event) => {
          setSelected(event)
          openModal(true);
        }}
        expanded={expanded}
        renderItem={(item) => {

          let project = projects?.find((a) => a.id == item.groupBy?.id);

          let eventPeople = (item.data?.people || []).map((x) => {
            return people?.find((a) => a.id == x)
          })

          return (
            <div style={{
              marginTop: '4px',
              marginBottom: '4px',
              flex: 1,
              // height: item.draft ? '80%' : undefined,
              borderRadius: '12px',
              zIndex: item.draft ? 0 : 99,
              background: item?.draft ? 'rgba(127, 127, 127, 0.4)' : (project?.colour || 'rgb(127, 127, 0, 1)')
            }}>
              {!item.expanded && <div style={{height: '30px'}} />}
              <Collapse in={item.expanded}>
                <Box sx={{display: 'flex', padding: '4px', flexDirection: 'column'}}>
                  <Box>
                    <Typography textAlign={'center'}>{project?.displayId} - {project?.name}</Typography>
                  </Box>
                  <Box>
                    {eventPeople.map((person) => (
                      <Typography>{person?.name}</Typography>
                    ))}
                  </Box>
                  
                </Box>
              </Collapse>
            </div>
          )
        }}
        getRowGroup={(event) => {
          const group = projects?.find((a) => a.id == event.groupBy?.id);
          return `${group?.displayId} - ${group?.name}`;
        }}
        events={
          projects.map((x) => x.draftSchedule.map((sched) => ({...sched, draft: true, groupBy: {...x}}))).reduce((prev, curr) => prev.concat(curr), []).concat(
          (calendarData?.calendarItems || []).map((x) => ({
            ...x
          }))
          )
          
        }
      // events={(schedule || []).map((x) => ({
      //   id: x?.id || '',
      //   people: x?.people || [],
      //   equipment: x?.equipment || [],
      //   project: {displayId: x?.project?.displayId || '', name: x?.project?.name?.toString() || '', id: x?.project?.id?.toString() || ''},
      //   notes: x?.notes || [],
      //   managers: x?.managers || [],
      //   start: x?.date,
      //   end: moment(x?.date).clone().add(1, 'days').toDate(),
      //   owner: {id: x?.owner?.id?.toString() || '', name: x?.owner?.name?.toString() || ''}
      // }))}
      />
      {/*             
        <ScheduleView 
          actions={{
            left: draftSchedule?.length > 0 && (<Button 
              onClick={() => openDrafts(!draftsOpen)} 
               hoverIndicator icon={draftsOpen ? <Previous /> : <Next />} />)
          }}
          isLoading={query.$state.isLoading}
      
          date={horizon.start}
          onHorizonChanged={async (start, end) => {
            setHorizon({start, end})

            
          
          }}
          events={(schedule || []).map((x) => ({
            id: x?.id || '',
            people: x?.people || [],
            equipment: x?.equipment || [],
            project: {displayId: x?.project?.displayId || '', name: x?.project?.name?.toString() || '', id: x?.project?.id?.toString() || ''},
            notes: x?.notes || [],
            managers: x?.managers || [],
            date: x?.date,
            owner: {id: x?.owner?.id?.toString() || '', name: x?.owner?.name?.toString() || ''}
          }))}
          onCreateItem={(ts) => {

            openModal(true);
            setModalDate(ts)
          
          }}

          onUpdateItem={(item) => {
            console.log({item})
            // if(item.canEdit){
              setSelected(item);
              openModal(true);
              setModalDate(item.date);
            // }
          }}
         
         /> */}
    </Box>
  );

}
