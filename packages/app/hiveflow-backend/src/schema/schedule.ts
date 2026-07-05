import { Prisma, PrismaClient } from "@prisma/client"
import { nanoid } from "nanoid";
import { LexoRank } from 'lexorank';
import { ensureGeneratedTasks } from "../utils/recurring";

export default (prisma: PrismaClient) => {

    const typeDefs = `

        type Query {
            calendarItems(where: CalendarWhere): [CalendarItem]
            scheduleItems(where: ScheduleWhere): [ScheduleItem]
            timelineItems(where: TimelineItemWhere): [TimelineItem]
            recurringSchedules: [RecurringSchedule!]!
            recurringSchedule(id: ID!): RecurringSchedule
        }

        type Mutation {
            createCalendarItem(input: CalendarItemInput): CalendarItem
            updateCalendarItem(id: ID, input: CalendarItemInput): CalendarItem
            deleteCalendarItem(id: ID): CalendarItem

            joinCalendarItem(id: ID): CalendarItem
            leaveCalendarItem(id: ID): CalendarItem

            commentOnCalendar(id: ID, message: String): Comment
            removeCommentOnCalendar(id: ID, comment: ID): Comment

            createTimeline(input: TimelineInput): Timeline
            updateTimeline(id: ID, input: TimelineInput): Timeline
            deleteTimeline(id: ID): Timeline

            createTimelineItem(prev: ID, input: TimelineItemInput): TimelineItem
            updateTimelineItem(id: ID, input: TimelineItemInput): TimelineItem
            deleteTimelineItem(id: ID): TimelineItem

            updateTimelineItemOrder(id: ID, prev: ID, next: ID): TimelineItem

            createTimelineItemDependency(source: ID, target: ID): TimelineItem 
            deleteTimelineItemDependency(source: ID, target: ID): TimelineItem 

            createScheduleItem(input: ScheduleItemInput): ScheduleItem
            updateScheduleItem(id: ID, input: ScheduleItemInput): ScheduleItem
            deleteScheduleItem(id: ID): ScheduleItem
            
            cloneScheduleItem(id: ID, dates: [DateTime]): [ScheduleItem]
            joinScheduleItem(id: ID): ScheduleItem
            leaveScheduleItem(id: ID): ScheduleItem

            createRecurringSchedule(input: RecurringScheduleInput!): RecurringSchedule!
            updateRecurringSchedule(id: ID!, input: RecurringScheduleUpdateInput!): RecurringSchedule!
            deleteRecurringSchedule(id: ID!): RecurringSchedule!
            createRecurringEvent(scheduleId: ID!, input: RecurringEventInput!): RecurringEvent!
            updateRecurringEvent(id: ID!, input: RecurringEventUpdateInput!): RecurringEvent!
            deleteRecurringEvent(id: ID!): RecurringEvent!
            splitRecurringEvent(id: ID!, newStartDate: String!, newEndDate: String): RecurringEvent!
        }
        
        input CalendarWhere {
            ids: [ID]
            start_LTE: DateTime
            end_GTE: DateTime
        }

        input CalendarItemInput {
            start: DateTime
            end: DateTime

            data: JSON
            groupBy: JSON
        }

        type CalendarItem {
            id: ID

            data: JSON
            groupBy: JSON

            start: DateTime
            end: DateTime

            comments: [Comment]

            permissions: [CalendarItemPermission]

            createdBy: HiveUser

            canEdit: Boolean
            isOwner: Boolean

        }

        type CalendarItemPermission {
            id: ID
            user: HiveUser
            item: CalendarItem
        }

        type Comment {
            id: ID
            
            message: String

            user: HiveUser

            createdAt: DateTime
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

            blocks: [TimelineItem]
            requires: [TimelineItem]

            rank: String

            timeline: String
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

        type RecurringSchedule {
            id: ID!
            displayId: String
            name: String
            description: String
            events: [RecurringEvent!]!
            eventCount: Int
            createdBy: HiveUser
            createdAt: DateTime
            updatedAt: DateTime
            organisation: HiveOrganisation
        }

        type RecurringEvent {
            id: ID!
            schedule: RecurringSchedule
            scheduleId: ID!
            parent: RecurringEvent
            parentId: ID
            children: [RecurringEvent!]
            name: String
            description: String
            frequency: String
            startDate: String
            endDate: String
            durationDays: Int
            assignedTo: String
            rowOrder: String
            exceptionDates: JSON
            taskTemplate: JSON
        }

        input RecurringScheduleInput {
            name: String!
            description: String
        }

        input RecurringScheduleUpdateInput {
            name: String
            description: String
        }

        input RecurringEventInput {
            name: String!
            description: String
            frequency: String
            startDate: String
            endDate: String
            durationDays: Int
            assignedTo: String
            rowOrder: String
            parentId: ID
            exceptionDates: JSON
            taskTemplate: JSON
        }

        input RecurringEventUpdateInput {
            name: String
            description: String
            frequency: String
            startDate: String
            endDate: String
            durationDays: Int
            assignedTo: String
            rowOrder: String
            parentId: ID
            exceptionDates: JSON
            taskTemplate: JSON
        }
    `

    const resolvers = {
        ScheduleItem: {
            canEdit: (root: any, args: any, context: any) => {
                const { managers, owner } = root;

                const list = (managers || []).concat([owner])

                const canEdit = list.map((x: any) => x.id).indexOf(context.jwt.id) > -1;

                
                return canEdit //list.map((x: {id: string}) => x.id).indexOf(context.jwt.id) > -1
            }
        },
        Comment: {
            user: (root: any) => {
                console.log({root})
                return {id: root?.user}
            }
        },
        CalendarItem: {
            createdBy: (root: any) => {
                return root.createdBy ? {
                    id: root?.createdBy
                } : null
            },
            isOwner: (root: any, args: any, context: any) => {
                return root?.createdBy == context?.jwt?.id;
            },
            canEdit: (root: any, args: any, context: any) => {
                const { permissions, createdBy } = root;

                const list = (permissions || []).map((x) => x.user).concat([createdBy])

                const canEdit = list.map((x: any) => x).indexOf(context.jwt.id) > -1;

                
                return canEdit //list.map((x: {id: string}) => x.id).indexOf(context.jwt.id) > -1
            }
        },
        CalendarItemPermission: {
            user: (root: any) => {
                console.log({root})
                return root?.user ? {id: root?.user} : null;
            }
        },
        RecurringSchedule: {
            eventCount: (root: any) => {
                return root.events?.length ?? 0;
            },
        },
        Query: {
            calendarItems: async (root: any, args: any, context: any) => {
                let query : any = {};

                if(args.where?.end_GTE) query['end'] = {...query['end'], gt: args.where.end_GTE};
                if(args.where?.start_LTE) query['start'] = {...query['start'], lt: args.where.start_LTE};
                if(args.where.ids) query['id'] = {in: args.where.ids};

                return await prisma.calendarItem.findMany({
                    where: {
                        ...query,
                        organisation: context?.jwt?.organisation
                    },
                    include: {
                        permissions: true,
                        comments: true
                    }
                })
            },
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
                    people: (item?.people || []).map((x) => ({id: x})),
                    owner: item.owner ? {id: item.owner} : undefined,
                    managers: item.permissions ? item.permissions.map((perm) => ({id: perm.owner})) : []
                }))

                return result;
            },
            timelineItems: async (root: any, args: any, context: any) => {
                // return await pri
                let whereArg: any = {organisation: context.jwt.organisation}
                if(args.where){
                    if(args.where.id) whereArg = {...whereArg, id: args.where.id};
                    if(args.where.timeline) whereArg = {...whereArg, timeline: args.where.timeline};
                    if(args.where.startDate_LTE) whereArg.startDate = {lte: args.where.startDate_LTE};
                    if(args.where.endDate_GTE) whereArg.endDate = {gte: args.where.endDate_GTE};
                }
                
                return await prisma.timelineItem.findMany({
                    where: {
                        ...whereArg,
                    },
                    include: {
                        project: true,
                        estimate: true,
                        blocks: true,
                        requires: true
                    }
                })
            },

            recurringSchedules: async (root: any, args: any, context: any) => {
                return prisma.recurringSchedule.findMany({
                    where: { organisation: context?.jwt?.organisation },
                    include: { events: true },
                    orderBy: { createdAt: 'desc' },
                });
            },

            recurringSchedule: async (root: any, args: any, context: any) => {
                return prisma.recurringSchedule.findFirst({
                    where: { id: args.id, organisation: context?.jwt?.organisation },
                    include: { events: true },
                });
            },
        },
        Mutation: {
            joinCalendarItem: async (root: any, args: any, context: any) => {
                const {permissions = []} = await prisma.calendarItem.findFirst({
                    where: {
                        id: args.id
                    },
                    include: {
                        permissions: true
                    }
                }) || {}
                if(permissions?.findIndex((a) => a.user == context?.jwt?.id) < 0){
                    await prisma.calendarItemPermissions.create({
                        data: {
                            id: nanoid(),
                            itemId: args.id,
                            user: context?.jwt?.id
                        }
                    })
                }
            },
            leaveCalendarItem: async (root: any, args: any, context: any) => {
                await prisma.calendarItemPermissions.deleteMany({
                    where: {
                        itemId: args.id,
                        user: context?.jwt?.id
                    }
                })
            },
            commentOnCalendar: async (root: any, args: any, context: any) => {
                console.log({context})
                const comment = await prisma.calendarItemComment.create({
                    data: {
                     
                        id: nanoid(),
                        message: args.message,
                        user: context?.jwt?.id,
                        itemId: args.id
                    }
                })
                
                return comment
            }, 
            removeCommentOnCalendar: async (root: any, args: any, context: any) => {
                const comment = await prisma.calendarItemComment.findFirst({
                    where: {
                        id: args.id,
                    }
                })
                
                return comment;
            },
            createCalendarItem: async (root: any, args: any, context: any) => {
                return await prisma.calendarItem.create({
                    data: {
                        id: nanoid(),
                        data: args.input.data,
                        groupBy: args.input.groupBy,
                        start: args.input.start,
                        end: args.input.end,
                        organisation: context?.jwt?.organisation,
                        createdBy: context?.jwt?.id
                    }
                })
            },
            updateCalendarItem: async (root: any, args: any, context: any) => {
                return await prisma.calendarItem.update({
                    where: {
                        id: args.id,
                    },
                    data: {
                        data: args.input.data,
                        groupBy: args.input.groupBy,
                        start: args.input.start,
                        end: args.input.end,
                    }
                })
            },
            deleteCalendarItem: async (root: any, args: any, context: any) => {
                return await prisma.calendarItem.delete({
                    where: {
                        id: args.id,
                    },
                })
            },
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
            createTimelineItem: async (root: any, args: {prev: string, input: any}, context: any) => {
                // return await prisma.

                let newRank;

                if(args.prev){

                    //Find previous item

                    const result = await prisma.$queryRaw<{id: string, rank: string, lead_rank?: string}>`WITH cte as (
                        SELECT id, rank FROM "TimelineItem" 
                        WHERE organisation=${context?.jwt?.organisation} AND timeline=${args.input?.timelineId}
                        ORDER BY rank
                    ), cte2 as (
                        SELECT id, rank, LEAD(rank) OVER (ORDER BY rank) as lead_rank FROM cte
                    )
                    SELECT id, rank, lead_rank FROM cte2 WHERE id=${args.prev}`

                    const { rank, lead_rank } = result?.[0];

                    let aboveRank = LexoRank.parse(rank || LexoRank.min().toString())
                    let belowRank = LexoRank.parse(lead_rank || LexoRank.max().toString())

                    newRank = aboveRank.between(belowRank).toString()
                }else{

                    //Fallback to finding first item in previous history window
                    const prevItem = await prisma.timelineItem.findFirst({
                        where: {
                            organisation: context?.jwt?.organisation,
                            timeline: args.input.timelineId,
                            endDate: {
                                lt: args.input.startDate
                            }
                        },
                        orderBy: {
                            endDate: 'desc'
                        }
                    })

                    //Fallback to finding first item in next history window
                    const nextItem = await prisma.timelineItem.findFirst({
                        where: {
                            organisation: context?.jwt?.organisation,
                            timeline: args.input.timelineId,
                            startDate: {
                                gt: args.input.endDate
                            }
                        },
                        orderBy: {
                            startDate: 'asc'
                        }
                    })

                    //Fallback to max min
                    let aboveRank = LexoRank.parse(prevItem?.rank || LexoRank.min().toString())
                    let belowRank = LexoRank.parse(nextItem?.rank || LexoRank.max().toString())

                    newRank = aboveRank.between(belowRank).toString()


                }

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
                        rank: newRank,
                        data: args.input.data,
                        startDate: args.input.startDate,
                        endDate: args.input.endDate,
                        notes: args.input.notes || '',
                        timeline: args.input.timelineId,
                        organisation: context?.jwt?.organisation
                    }
                })
            },
            updateTimelineItemOrder: async (root: any, args: any, context: any) => {

                const { prev, next } = args;

                const item = await prisma.timelineItem.findFirst({where: {id: args.id, organisation: context?.jwt?.organisation }});

                const isForward = prev != undefined;

                const result = await prisma.$queryRaw<{id: string, rank: string, lead_rank?: string}>`WITH cte as (
                    SELECT id, rank FROM "TimelineItem" 
                    WHERE organisation=${context?.jwt?.organisation} AND timeline=${item?.timeline}
                    ORDER BY rank
                ), cte2 as (
                    SELECT id, rank, ${isForward ? Prisma.sql`LEAD(rank)` : Prisma.sql`LAG(rank)`} OVER (ORDER BY rank) as lead_rank FROM cte
                )
                SELECT id, rank, lead_rank FROM cte2 WHERE id=${prev || next}
                
                `
                
                const { rank, lead_rank } = result?.[0]

                const belowRank = LexoRank.parse((isForward ? rank : lead_rank) || LexoRank.min().toString());
                const aboveRank = LexoRank.parse((isForward ? lead_rank : rank) || LexoRank.max().toString()); //TODO anything but just using max

                const newRank = belowRank.between(aboveRank)


                return await prisma.timelineItem.update({
                    where: {
                        id: args.id
                    },
                    data: {
                        rank: newRank.toString()
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
            createTimelineItemDependency: async (root: any, args: {source: string, target: string}) => {
                return await prisma.timelineItem.update({
                    where: {
                        id: args.source
                    },
                    data: {
                        blocks: {
                            connect: {id: args.target}
                        }
                    }
                })
            },
            deleteTimelineItemDependency: async (root: any, args: {source: string, target: string}) => {
                return await prisma.timelineItem.update({
                    where: {
                        id: args.source
                    },
                    data: {
                        blocks: {
                            disconnect: {
                                id: args.target
                            }
                        }
                    }
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
                        people: args.input.people ? {
                            set: args.input.people || []
                        } : undefined,
                        equipment: args.input.equipment ? {
                            set: args.input.equipment?.map((x: any) => ({id: x})) || []
                        } : undefined,
                        project: args.input.project ? {
                            connect: {id: args.input.project}
                        } : undefined
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
            },

            // ── Recurring Schedules ──────────────────────────

            createRecurringSchedule: async (root: any, args: any, context: any) => {
                return prisma.recurringSchedule.create({
                    data: {
                        id: nanoid(),
                        name: args.input.name,
                        description: args.input.description,
                        createdBy: context?.jwt?.id,
                        organisation: context?.jwt?.organisation,
                    },
                    include: { events: true },
                });
            },

            updateRecurringSchedule: async (root: any, args: any, context: any) => {
                return prisma.recurringSchedule.update({
                    where: { id: args.id },
                    data: {
                        name: args.input.name ?? undefined,
                        description: args.input.description ?? undefined,
                    },
                    include: { events: true },
                });
            },

            deleteRecurringSchedule: async (root: any, args: any, context: any) => {
                return prisma.recurringSchedule.delete({
                    where: { id: args.id },
                    include: { events: true },
                });
            },

            createRecurringEvent: async (root: any, args: any, context: any) => {
                const event = await prisma.recurringEvent.create({
                    data: {
                        id: nanoid(),
                        scheduleId: args.scheduleId,
                        name: args.input.name,
                        description: args.input.description,
                        frequency: args.input.frequency || 'monthly',
                        startDate: args.input.startDate || new Date().toISOString().slice(0, 10),
                        endDate: args.input.endDate || undefined,
                        durationDays: args.input.durationDays ?? undefined,
                        assignedTo: args.input.assignedTo,
                        parentId: args.input.parentId || undefined,
                        rowOrder: args.input.rowOrder || undefined,
                        exceptionDates: args.input.exceptionDates || undefined,
                        taskTemplate: args.input.taskTemplate || undefined,
                        organisation: context?.jwt?.organisation,
                    },
                });

                // Seed upcoming tasks for the new event (always, even if unassigned)
                {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const horizonEnd = new Date(today);
                    horizonEnd.setDate(horizonEnd.getDate() + 90);
                    await ensureGeneratedTasks(prisma, event as any, today, horizonEnd);
                }

                return event;
            },

            updateRecurringEvent: async (root: any, args: any, context: any) => {
                const updated = await prisma.recurringEvent.update({
                    where: { id: args.id },
                    data: {
                        name: args.input.name ?? undefined,
                        description: args.input.description ?? undefined,
                        frequency: args.input.frequency ?? undefined,
                        startDate: args.input.startDate ?? undefined,
                        endDate: args.input.endDate ?? undefined,
                        durationDays: 'durationDays' in (args.input || {}) ? args.input.durationDays : undefined,
                        assignedTo: args.input.assignedTo ?? undefined,
                        parentId: 'parentId' in (args.input || {}) ? args.input.parentId : undefined,
                        taskTemplate: args.input.taskTemplate ?? undefined,
                        rowOrder: args.input.rowOrder ?? undefined,
                        exceptionDates: 'exceptionDates' in (args.input || {}) ? args.input.exceptionDates : undefined,
                    },
                });

                // Reseed tasks after changes (always, even if unassigned)
                {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const horizonEnd = new Date(today);
                    horizonEnd.setDate(horizonEnd.getDate() + 90);
                    await ensureGeneratedTasks(prisma, updated as any, today, horizonEnd);
                }

                return updated;
            },

            deleteRecurringEvent: async (root: any, args: any, context: any) => {
                return prisma.recurringEvent.delete({
                    where: { id: args.id },
                });
            },

            splitRecurringEvent: async (root: any, args: any, context: any) => {
                // Find the original event
                const original = await prisma.recurringEvent.findUnique({
                    where: { id: args.id },
                });
                if (!original) throw new Error('Event not found');

                // Create a new child event with the same properties but shifted start
                return prisma.recurringEvent.create({
                    data: {
                        id: nanoid(),
                        scheduleId: original.scheduleId,
                        parentId: original.id,
                        name: original.name,
                        description: original.description,
                        frequency: original.frequency,
                        startDate: args.newStartDate,
                        endDate: args.newEndDate || undefined,
                        assignedTo: original.assignedTo,
                        organisation: context?.jwt?.organisation || original.organisation,
                    },
                });
            },
        }
    };

    return {
        typeDefs,
        resolvers
    }
}