import { PrismaClient } from "@prisma/client"
import { nanoid } from "nanoid";

export default (prisma: PrismaClient) => {

    const typeDefs = `

        type Query {
            schedule: [ScheduleItem]
            timelines(where: TimelineWhere): [Timeline]
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
            items: [TimelineItemItems!]! 
            project: TimelineProject
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
            people: [People!]!
            equipment: [Equipment!]!
            notes: [String]
            owner: HiveUser 
            managers: [HiveUser!]! 

            organisation: HiveOrganisation 
        }
    `

    const resolvers = {
        Query: {
            schedule: async (root: any, args: any, context: any) => {
                return await prisma.scheduleItem.findMany({where: {organisation: context.jwt.organisation}})
            },
            timelines: async (root: any, args: any, context: any) => {
                // return await pri
                let whereArg: any = {organisation: context.jwt.organisation}
                if(args.where){
                    if(args.where.id) whereArg = {...whereArg, id: args.where.id};
                    if(args.where.name) whereArg = {...whereArg, name: args.where.name};
                }
                return await prisma.timeline.findMany({where: whereArg, include: {items: true}})
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
                return await prisma.timelineItem.create({
                    data: {
                        id: nanoid(),
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
                return await prisma.timelineItem.update({
                    where: {id: args.id},
                    data: {
                        startDate: args.input.startDate,
                        endDate: args.input.endDate,
                        notes: args.input.notes || '',
                        timeline: {
                            connect: {
                                id: args.input.timelineId
                            }
                        }
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
                return await prisma.scheduleItem.create({
                    data: {
                        id: nanoid(),
                        date: args.input.date,
                        notes: args.input.notes || '',
                        project: {
                            connect: {id: args.input.project}
                        },
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