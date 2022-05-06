import React, {
  Component, useState
} from 'react';
import { Box, Button, Collapsible } from 'grommet'
import { ScheduleView } from '@hexhive/ui';
import { mutation, useRefetch, useMutation, useQuery, resolved } from '@hive-flow/api';
import moment from 'moment';
import { schedule as scheduleActions } from '../../actions'
import { useContext } from 'react';
import { AuthContext, useAuth } from '@hexhive/auth-ui';
import { useEffect } from 'react';
import { Menu, Previous, Next } from 'grommet-icons';
import {DraftPane } from './draft-pane';
import { useQuery as useApollo, gql, useApolloClient } from '@apollo/client';
import { ScheduleItem, ScheduleModal } from '../../modals/schedule';

export const Schedule : React.FC<any> = (props) =>  {

  //User
  const [ modalOpen, openModal ] = useState(false);
  const [ modalDate, setModalDate ] = useState<Date>();

  const [ selected, setSelected ] = useState<ScheduleItem>();

  const { activeUser } = useAuth() //{activeUser: {sub: '1'}}

  const client = useApolloClient();

  const [ horizon, setHorizon ] = useState<{start: Date, end: Date}>({
    start: new Date( moment(new Date()).startOf('isoWeek').valueOf() ),
    end: new Date( moment(new Date()).endOf('isoWeek').valueOf() )
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
      users {
        id
        name
      }
      projects{
        id
        displayId
        name
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
     timelineItems (where: {timeline: "Projects", startDate_LTE: $endDate, endDate_GTE: $startDate}){
       id
       project{
            id
            name
       }

       estimate {
            id
            name
       }
       items {
          type
          location
          estimate
       }
     }
    scheduleItems (where: {date_GTE: $startDate, date_LTE: $endDate} ) {
      id
      date
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
    }
   
  }
  `, {
    variables: {
      startDate: horizon?.start?.toISOString(),
      endDate: horizon?.end?.toISOString()
    }
  })

  const refetchSchedule = () => {
    client.refetchQueries({
      include: ['Q', 'Slow']
    })
  }

  const draftSchedule = data?.timelineItems || []
  const schedule : any[] = data?.scheduleItems || []//query.scheduleItems({where: {date_GT: horizon.start?.toISOString(), date_LT: horizon.end?.toISOString()}})

  const projects = slowData?.projects || []// query.projects({})?.map((x) => ({...x})) || [];
  const people = slowData?.users || []// query.people({})?.map((x) => ({...x})) || [];
  const equipment = slowData?.equipment || [] //query.equipment({})?.map((x) => ({...x})) || []

  const users = slowData?.hiveUsers || [] //query.hiveUsers({})?.map((x) => ({...x})) || []

  const [createItem, info] = useMutation((mutation, args: {item: any}) => {
    let query = {};

    if(!args.item.project) return {error: 'Project is required'}

    if(args.item.equipment?.length > 0){
      query = {
        ...query,
        equipment: {
          connect: [{where: {node: {id_IN: args.item?.equipment?.map((x: any) => x.id)}}}]
        },
      }
    }

    if(args.item.people?.length > 0){
      query = {
        ...query,
        people: {
          connect: [{where: {node: {id_IN: args.item?.people?.map((x: any) => x.id)}}}]
        },
      }
    }
    if(args.item.notes){
      query = {
        ...query,
        notes: args.item.notes
      }
    }
    const result = mutation.createScheduleItem({ 
      input: {
        date: args.item.date,
        project: args.item.project,
      }
    })
    return {
      item: {
        ...result
      },
      error: null
    }
  }, {
    onCompleted(data) {},
    onError(error) {},
    refetchQueries: [],
    awaitRefetchQueries: true,
    suspense: false,  
  })

  const [updateItem, infoItem] = useMutation((mutation, args: {id: string, item: any}) => {
    
    
    // let oldScheduleItem = schedule.find((a) => a.id == args.id)
    
    // let add_people = args.item.people.filter((a: any) => oldScheduleItem.people.map((x: any) => x.id).indexOf(a.id) < 0)
    // let remove_people = oldScheduleItem.people.filter((a: any) => args.item.people.map((x: any) => x.id).indexOf(a.id) < 0)

    // let add_equipment = args.item.equipment.filter((a: any) => oldScheduleItem.equipment.map((x: any) => x.id).indexOf(a.id) < 0)
    // let remove_equipment = oldScheduleItem.equipment.filter((a: any) => args.item.equipment.map((x: any) => x.id).indexOf(a.id) < 0)


    let query : any = {
      
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

    const result = mutation.updateScheduleItem({id: args.id, input: {
        ...args.item
    }})

    return {
      item: {
        ...result
      },
      error: null
    }
  }, {
    onCompleted(data) {},
    onError(error) {},
    refetchQueries: [],
    awaitRefetchQueries: true,
    suspense: false,  
  })

  const [removeItem, infoRemove] = useMutation((mutation, args: {id: string}) => {
    if(!args.id) return {error: "Item Id is required"}
    const result = mutation.deleteScheduleItem({id: args.id})
    return {
      item: {
        ...result
      },
      error: null
    }
  }, {
    onCompleted(data) {},
    onError(error) {},
    refetchQueries: [],
    awaitRefetchQueries: true,
    suspense: false,  
  })

  const [joinCard, joinInfo] = useMutation((mutation, args: {id: string}) => {
    if(!activeUser?.id) return;
 
    const result = mutation.manageScheduleItem({
      id: args.id
    })
    return {
      item: {
        success: result
      },
      error: null
    }
  }, {
    onCompleted(data) {},
    onError(error) {},
    refetchQueries: [],
    awaitRefetchQueries: true,
    suspense: false,  
  })


  const [leaveCard, leaveInfo] = useMutation((mutation, args: {id: string}) => {
    if(!activeUser?.id) return;
    const result = mutation.handoverScheduleItem({
      id: args.id
    })
    return {
      item: result,
      error: null
    }
  }, {
    onCompleted(data) {},
    onError(error) {},
    refetchQueries: [],
    awaitRefetchQueries: true,
    suspense: false,  
  })

  const [cloneItem, cloenInfo] = useMutation((mutation, args: {item: any, dates: Date[]}) => {
    
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
  }, {
    onCompleted(data) {},
    onError(error) {},
    refetchQueries: [],
    awaitRefetchQueries: true,
    suspense: false,  
  })

  
  const [ draftsOpen, openDrafts ] = useState<boolean>(false);


    return (
      <Box
        direction="row"
         flex className="schedule-container">
   
          <DraftPane  
            open={draftsOpen}
            drafts={draftSchedule}
            projects={projects} />

          <ScheduleModal
            selected={selected}
              open={modalOpen}
              date={modalDate}
              projects={projects}
              people={people}
              equipment={equipment}
              onDelete={() => {
                removeItem({
                  args: {
                    id: selected?.id
                  }
                }).then(() => {
                  openModal(false);
                  setModalDate(undefined);
                  setSelected(undefined)
                  refetchSchedule();
                })
              }}
              onSubmit={(item) => {
                //TODO create schedule item
                if(!item.id){
                  createItem({
                    args: {
                      item: {
                        project: item.project,
                        date: modalDate
                      }
                    }
                  }).then(() => {
                    openModal(false);
                    setModalDate(undefined);
                    setSelected(undefined)
                    refetchSchedule();
                  })
                }else{
                  updateItem({
                    args: {
                      id: selected.id,
                      item: {
                        project: item.project,
                        date: modalDate
                      }
                    }
                  }).then(() => {
                    openModal(false);
                    setModalDate(undefined);
                    setSelected(undefined)
                    refetchSchedule();
                  })
                }
              }}
              onClose={() => {
                openModal(false)
                setModalDate(undefined)
                setSelected(undefined)
              }}
            />
        <ScheduleView 
          actions={{
            left: draftSchedule?.length > 0 && (<Button 
              onClick={() => openDrafts(!draftsOpen)} 
               hoverIndicator icon={draftsOpen ? <Previous /> : <Next />} />)
          }}
          isLoading={query.$state.isLoading}
          onJoinCard={(card: any) => {
            joinCard({args: {id: card.id}}).then((resp) => {
              refetchSchedule()
            })

          }}
          onLeaveCard={(card: any) => {
            leaveCard({args: {id: card.id}}).then((resp) => {
            })
          }}
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

            setSelected(item);
            openModal(true);
            setModalDate(item.date);
          }}
         
         />
      </Box>
    );

}
