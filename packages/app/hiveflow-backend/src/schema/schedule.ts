import { PrismaClient } from "@prisma/client"
import { nanoid } from "nanoid";

export default (prisma: PrismaClient) => {

    const typeDefs = `

        type Query {
            scheduleItems(where: ScheduleWhere): [ScheduleItem]
            timelineItems(where: TimelineItemWhere): [TimelineItem]
        }

        type Mutation {
            createTimeline(input: TimelineInput): Timeline
            updateTimeline(id: ID, input: TimelineInput): Timeline
            deleteTimeline(id: ID): Timeline

            createTimelineItem(input: TimelineItemInput): TimelineItem
            updateTimelineItem(id: ID, input: TimelineItemInput): TimelineItem
            deleteTimelineItem(id: ID): TimelineItem

            createScheduleItem(input: ScheduleItemInput): ScheduleItem
            updateScheduleItem(id: ID, input: ScheduleItemInput): ScheduleItem
            deleteScheduleItem(id: ID): ScheduleItem
            
            cloneScheduleItem(id: ID, dates: [DateTime]): [ScheduleItem]
            joinScheduleItem(id: ID): ScheduleItem
            leaveScheduleItem(id: ID): ScheduleItem
        }

        type TimelineItemItems {
            id: ID 
            type: String
            location: String
            estimate: Float
            item: TimelineItem 
        }

        union TimelineProject = Project | Estimate

        input TimelineWhere {
            id: ID
            name: String
        }

        input TimelineItemWhere {
            id: ID
            timeline: String
            startDate_LTE: DateTime
            endDate_GTE: DateTime
        }

        input ScheduleWhere {
            id: ID
            date_GTE: DateTime
            date_LTE: DateTime
            project: String
        }

        input TimelineInput {
            name: String
        }
        
        type Timeline {
            id: ID
            name: String
            items: [TimelineItem]
            organisation: HiveOrganisation 
        }
        
        input TimelineItemInput {
            timelineId: String
            project: String
            estimate: String
            startDate: DateTime
            endDate: DateTime
            notes: String
            data: [TimelineItemDataInput]
        }

        input TimelineItemDataInput {
            item: String
            location: String
            quantity: Float
        }
        
        type TimelineItemData {
            item: String
            location: String
            quantity: Float
        }

        type TimelineItem {
            id: ID 
            timeline: Timeline
            startDate: DateTime
            endDate: DateTime
            notes: String
            items: [TimelineItemItems] 
            project: Project
            estimate: Estimate
            data: [TimelineItemData]
            organisation: HiveOrganisation 
        }

        type Schedule {
            id: ID
            name: String
            createdBy: HiveUser

            organisation: HiveOrganisation
        }

        input ScheduleItemInput {
            date: DateTime
            
            project: ID
            people: [ID]
            equipment: [ID]
            notes: [String]

            managers: [ID]
        }

        type ScheduleItem {
            id: ID
            date: DateTime
            project: Project
            people: [HiveUser]
            equipment: [Equipment]
            notes: [String]

            canEdit: Boolean

            managers: [HiveUser] 
            owner: HiveUser 

            createdAt: DateTime

            organisation: HiveOrganisation 
        }
    `

    const resolvers = {
        ScheduleItem: {
            canEdit: (root: any, args: any, context: any) => {
                const { managers, owner } = root;

                const list = (managers || []).concat(owner)
                return list.map((x: {id: string}) => x.id).indexOf(context.jwt.id) > -1
            }
        },
        Query: {
            scheduleItems: async (root: any, args: any, context: any) => {

                let query : any = {};

                if(args.where?.date_GTE) query['date'] = {...query['date'], gte: args.where.date_GTE};
                if(args.where?.date_LTE) query['date'] = {...query['date'], lte: args.where.date_LTE};
                if(args.where?.id) query['id'] = args.where.id;
                if(args.where?.project) query['project'] = {displayId: args.where?.project}; 
                
                const items = await prisma.scheduleItem.findMany({
                    where: {
                        organisation: context.jwt.organisation,
                        ...query
                    },
                    include: {
                        project: true,
                        equipment: true,
                        permissions: true
                    }
                })

                const result = items.map((item) => ({
                    ...item,
                    people: item?.people?.map((x) => ({id: x})),
                    owner: item.owner ? {id: item.owner} : undefined,
                    managers: item.permissions ? item.permissions.map((perm) => ({id: perm.owner})) : []
                }))
                console.log({result})
                return result;
            },
            // timelines: async (root: any, args: any) => {
            //     return await prisma.timeline.findMany({include: {items: true}});
            // },
            timelineItems: async (root: any, args: any, context: any) => {
                // return await pri
                let whereArg: any = {organisation: context.jwt.organisation}
                if(args.where){
                    if(args.where.id) whereArg = {...whereArg, id: args.where.id};
                    if(args.where.timeline) whereArg = {...whereArg, timeline: {id: args.where.timeline}};
                }
                
                return await prisma.timelineItem.findMany({
                    where: {
                        id: args.where.id,
                        timeline:  args.where.timeline
                    },
                    include: {
                        project: true,
                        estimate: true
                    }
                })
            }
        },
        Mutation: {
            // createTimeline: async (root: any, args: {input: any}, context: any) => {
            //     return await prisma.timeline.create({
            //         data: {
            //             id: nanoid(),
            //             name: args.input.name,
            //             organisation: context.jwt.organisation
            //         }
            //     })
            // },
            // updateTimeline: async (root: any, args: {id: any, input: any}, context: any) => {
            //     return await prisma.timeline.update({
            //         where: {id: args.id},
            //         data: {
            //             name: args.input.name
            //         }
            //     })
            // },
            // deleteTimeline: async (root: any, args: {id: any}, context: any) => {
            //     return await prisma.timeline.delete({where: {id: args.id}});
            // },
            createTimelineItem: async (root: any, args: {input: any}, context: any) => {
                // return await prisma.

                let relatedItem : any = {};
                if(args.input.project) relatedItem = {
                    project: {
                        connect: {id: args.input.project}
                    },
                }
                if(args.input.estimate){
                    relatedItem = {
                        estimate: {
                            connect: {id: args.input.estimate}
                        },
                    }
                }
                return await prisma.timelineItem.create({
                    data: {
                        id: nanoid(),
                        ...relatedItem,
                        data: args.input.data,
                        startDate: args.input.startDate,
                        endDate: args.input.endDate,
                        notes: args.input.notes || '',
                        timeline: args.input.timelineId
                    }
                })
            },
            updateTimelineItem: async (root: any, args: {id: string, input: any}, context: any) => {
                let relatedItem : any = {};
                if(args.input.project) relatedItem = {
                    projectId: args.input.project,
                    estimateId: undefined
                }
                if(args.input.estimate){
                    relatedItem = {
                        estimateId: args.input.estimate,
                        
                        project: undefined
                    }
                }

                return await prisma.timelineItem.update({
                    where: {id: args.id},
                    data: {
                        ...relatedItem,
                        startDate: args.input.startDate,
                        endDate: args.input.endDate,
                        notes: args.input.notes || '',
                        data: args.input.data
                        // timeline: {
                        //     connect: {
                        //         id: args.input.timelineId
                        //     }
                        // }
                    }
                })
            },
            deleteTimelineItem: async (root: any, args: {id: string}) => {
                return await prisma.timelineItem.delete({
                    where: {id: args.id}
                })
            },
            createScheduleItem: async (root: any, args: {input: any}, context: any) => {
                // return await prisma.
                // console.log({jwt: context.jwt})
                return await prisma.scheduleItem.create({
                    data: {
                        id: nanoid(),
                        date: args.input.date,
                        notes: args.input.notes || [],
                        people: {
                            set: args.input.people || []
                        },
                        equipment: {
                            connect: args.input.equipment?.map((x: any) => ({id: x})) || []
                        },
                        project: {
                            connect: {id: args.input.project}
                        },
                        owner: context.jwt.id,
                        organisation: context.jwt.organisation
                    }
                })
            },
            updateScheduleItem: async (root: any, args: {id: string, input: any}, context: any) => {
                return await prisma.scheduleItem.update({
                    where: {id: args.id},
                    data: {
                        date: args.input.date,
                        notes: args.input.notes || [],
                        people: {
                            set: args.input.people || []
                        },
                        equipment: {
                            set: args.input.equipment?.map((x: any) => ({id: x})) || []
                        },
                        project: {
                            connect: {id: args.input.project}
                        }
                    }
                })
            },
            cloneScheduleItem: async (root: any, args: {id: string, dates: Date[]}, context: any) => {
                //TODO check ownership
                const item = await prisma.scheduleItem.findFirst({where: {id: args.id}, include: {equipment: true, project: true}})
                if(!item) throw new Error("No Schedule Item");

                return await Promise.all(args.dates.map(async (date) => {
                    return await prisma.scheduleItem.create({
                        data: {
                            id: nanoid(),
                            project: {connect: {id: item.projectId}},
                            date: date,
                            people: item.people,
                            equipment: {connect: item.equipment.map((x) => ({id: x.id}))},
                            notes: item.notes,
                            organisation: item.organisation,
                            owner: item.owner
                        }
                    })
                }))
               
            },
            joinScheduleItem: async (root: any, args: any, context: any) => {
                return await prisma.scheduleItem.update({
                    where: {id: args.id},
                    data: {
                        permissions: {
                            upsert: [{
                                where: {schedulePermitted: {scheduleItemId: args.id, owner: context?.jwt?.id}},
                                create: {
                                    id: nanoid(),
                                    owner: context?.jwt?.id
                                },
                                update: {
                                    owner: context?.jwt?.id
                                }
                            }]
                        }
                    }
                })
            },
            leaveScheduleItem: async (root: any, args: any, context: any) => {
                return await prisma.scheduleItem.update({
                    where: {id: args.id},
                    data: {
                        permissions: {
                            delete: [{
                                schedulePermitted: {
                                    scheduleItemId: args.id,
                                    owner: context?.jwt?.id
                                }
                            }]
                        }
                    }
                })
            },
            deleteScheduleItem: async (root: any, args: {id: string}) => {
                return await prisma.scheduleItem.delete({
                    where: {id: args.id}
                })
            }
        }
    };

    return {
        typeDefs,
        resolvers
    }
}