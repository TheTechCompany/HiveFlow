import { PrismaClient } from "@prisma/client"
import { nanoid } from "nanoid";

export default (prisma: PrismaClient) => {

    const typeDefs = `

        type Query {
            scheduleItems(where: ScheduleWhere): [ScheduleItem]
            timelines(where: TimelineWhere): [Timeline]
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

            manageScheduleItem(id: ID): Boolean
            handoverScheduleItem(id: ID): Boolean
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
            people: [People]
            equipment: [Equipment]
            notes: [String]
            managers: [HiveUser] 

            owner: HiveUser 

            organisation: HiveOrganisation 
        }
    `

    const resolvers = {
        Query: {
            scheduleItems: async (root: any, args: any, context: any) => {

                let query : any = {};

                if(args.where?.date_GTE) query['date'] = {...query['date'], gte: args.where.date_GTE};
                if(args.where?.date_LTE) query['date'] = {...query['date'], lte: args.where.date_LTE};
                if(args.where?.id) query['id'] = args.where.id;

                const items = await prisma.scheduleItem.findMany({
                    where: {
                        organisation: context.jwt.organisation,
                        ...query
                    },
                    include: {
                        project: true,
                        
                    }
                })
                return items.map((item) => ({
                    ...item,
                    owner: item.owner ? {id: item.owner} : undefined
                }))
            },
            timelines: async (root: any, args: any) => {
                return await prisma.timeline.findMany({include: {items: true}});
            },
            timelineItems: async (root: any, args: any, context: any) => {
                // return await pri
                let whereArg: any = {organisation: context.jwt.organisation}
                if(args.where){
                    if(args.where.id) whereArg = {...whereArg, id: args.where.id};
                    if(args.where.timeline) whereArg = {...whereArg, timeline: {id: args.where.timeline}};
                }
                
                console.log({whereArg, where: args.where})

                return await prisma.timelineItem.findMany({
                    where: {
                        id: args.where.id,
                        timeline: {
                            id: args.where.timeline
                        }
                    },
                    include: {
                        project: true,
                        estimate: true
                    }
                })
            }
        },
        Mutation: {
            createTimeline: async (root: any, args: {input: any}, context: any) => {
                return await prisma.timeline.create({
                    data: {
                        id: nanoid(),
                        name: args.input.name,
                        organisation: context.jwt.organisation
                    }
                })
            },
            updateTimeline: async (root: any, args: {id: any, input: any}, context: any) => {
                return await prisma.timeline.update({
                    where: {id: args.id},
                    data: {
                        name: args.input.name
                    }
                })
            },
            deleteTimeline: async (root: any, args: {id: any}, context: any) => {
                return await prisma.timeline.delete({where: {id: args.id}});
            },
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
                        startDate: args.input.startDate,
                        endDate: args.input.endDate,
                        notes: args.input.notes || '',
                        timeline: {
                            connect: {id: args.input.timelineId}
                        }
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
                console.log({jwt: context.jwt})
                return await prisma.scheduleItem.create({
                    data: {
                        id: nanoid(),
                        date: args.input.date,
                        notes: args.input.notes || [],
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
                        notes: args.input.notes || '',
                        project: {
                            connect: {id: args.input.project}
                        }
                    }
                })
            },
            deleteScheduleItem: async (root: any, args: {id: string}) => {
                return await prisma.scheduleItem.delete({
                    where: {id: args.id}
                })
            },
            manageScheduleItem: async (root: any, args: any, context: any) => {
                console.log({Jwt: context.jwt})
                const res = await prisma.scheduleItem.update({
                    where: {id: args.id},
                    data: {
                        permissions: {
                            upsert: [{
                                where: {schedulePermitted: {scheduleItemId: args.id, owner: context.jwt.id}},
                                create: {
                                    id: nanoid(),
                                    owner: context.jwt.id
                                },
                                update: {

                                }  
                            }]
                        }
                    }
                })
                return res != null
            },
            handoverScheduleItem: async (root: any, args: any, context: any) => {
                const res = await prisma.scheduleItem.update({
                    where: {id: args.id},
                    data: {
                        permissions: {
                            delete: {
                                schedulePermitted: {
                                    owner: context.jwt.id,
                                    scheduleItemId: args.id
                                }
                            }
                        }
                    }
                });
                return res != null;
            }
        }
    };

    return {
        typeDefs,
        resolvers
    }
}