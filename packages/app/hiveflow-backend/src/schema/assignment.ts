import { PrismaClient } from "@prisma/client"
import { nanoid } from "nanoid";

export default (prisma: PrismaClient) => {

    const resolvers = {
        AssignedTask: {
            __resolveType: (root: any) => {
                // All tasks are now the unified Task type
                return 'Task';
            }
        },
        HiveUser:{ 
            leave: (root: any, args: any) => {
                return root.leave?.filter((item: any) => {
                    if(!args.where) return true;
                    return item.start < args.where.start_LTE && item.end > args.where.end_GTE
                })
            }
        },
        Mutation: {
            assignLeave: async (root: any, args: any, context: any) => {
                return await prisma.leaveAssignment.create({
                    data: {
                        id: nanoid(),
                        start: args.start,
                        end: args.end,
                        user: args.id,
                        createdBy: context?.jwt?.id,
                        organisation: context?.jwt?.organisation
                    }
                })
            },
            updateLeave: async (root: any, args: any, context: any) => {
                return await prisma.leaveAssignment.update({
                    where: { id: args.leave },
                    data: {
                        user: args.id,
                        start: args.start,
                        end: args.end
                    }
                })
            },
            removeLeave: async (root: any, args: any, context: any) => {
                return await prisma.leaveAssignment.delete({
                    where: { id: args.leave }
                })
            },
            updateSkillAssignment: async (root: any, args: any, context: any) => {
                await prisma.skillAssignment.upsert({
                    where: {
                        user_skill: {
                            user: args.user,
                            skill: args.skill
                        }
                    },
                    create: {
                        id: nanoid(),
                        user: args.user,
                        skill: args.skill,
                        skillData: args.skillData,
                        organisation: context?.jwt?.organisation
                    },
                    update: {
                        skill: args.skill,
                        skillData: args.skillData,
                        organisation: context?.jwt?.organisation
                    }
                })
            },
            deleteSkillAssignment: async (root: any, args: any) => {
                await prisma.skillAssignment.delete({
                    where: { id: args.id }
                })
            }
        },

        Query: {
            userLeave: async (root: any, args: any, context: any) => {
                let query : any = {
                    organisation: context?.jwt?.organisation
                };
                if(args.ids){
                    query.user = {in: args.ids}
                }

                const leaveRows = await prisma.leaveAssignment.findMany({
                    where: { ...query }
                })

                const rows = [...new Set(leaveRows.map((x: any) => x.user).concat(args.ids || []))]
                const result = (args.ids || rows).map((r: any) => {
                    let leave = leaveRows.filter((a: any) => a.user == r)
                    return { id: r, leave }
                })
                return result;
            },
            skills: async (root: any, args: any) => {
                let where : any = {};
                if(args.user){
                    where.user = args.user;
                }
                const skills = await prisma.skillAssignment.findMany({
                    where: { ...where }
                })

                if(args.user){
                    return skills;
                }else{
                    const unique = [...new Set(skills.map((x: any) => x.skill))]
                    return unique.map((x: any) => ({skill: x}))
                }
            },
        
            assignments: async (root: any, args: any, context: any)=> {
                let where : any = {};
				if(args.where?.start){
					where.startDate = { lt: args.where.start };
				}
				if(args.where?.end){
					where.endDate = { gt: args.where.end };
				}

                if(args.where?.status){
                    where.status = {in: args.where.status}
                }

				if(args.ids){
					where['id'] = {in: args.ids}
				}

                if(args.where?.displayId){
                    where['displayId'] = args.where.displayId
                }

                // ── Fetch unified tasks ────────────────────────────
                const tasks = await prisma.task.findMany({
                    where: {
                        ...where,
                        OR: [
                            {
                                project: { organisation: context?.jwt?.organisation },
                                members: { has: context?.jwt?.id },
                            },
                            {
                                estimate: { organisation: context?.jwt?.organisation },
                                members: { has: context?.jwt?.id },
                            },
                            {
                                recurringEventId: { not: null },
                                members: { has: context?.jwt?.id },
                            },
                            {
                                // Unassigned recurring tasks — visible to everyone in the org
                                recurringEventId: { not: null },
                                members: { isEmpty: true },
                            },
                        ],
                    },
                    include: {
                        project: true,
                        estimate: true,
                        parent: true,
                        children: true,
                        recurringEvent: {
                            include: { schedule: true },
                        },
                    },
                });

                return tasks.map((x: any) => ({
                    ...x,
                    createdBy: x.createdBy ? { id: x.createdBy } : undefined,
                    members: x.members?.map((member: string) => ({ id: member })),
                    organisation: { id: x.organisation || context?.jwt?.organisation },
                }));
            }
        },
        
    }

    const typeDefs = `

    union AssignedTask = Task

    type Query {
        userLeave(ids: [ID]): [HiveUser] @merge(keyField: "id", keyArg: "ids")
        skills(user: ID): [SkillAssignment]
        assignments(ids: [ID], where: AssignedWhere, horizonDays: Int): [AssignedTask!]!
    }

    # ── Generated task creation ────────────────────────────────

    type Mutation {
        generateRecurringTasks(horizonDays: Int!): [Task!]!
        updateSkillAssignment(skill: String, skillData: JSON, user: String): SkillAssignment
        deleteSkillAssignment(id: ID): SkillAssignment

        assignLeave(id: ID, start: DateTime, end: DateTime): LeaveAssignment
        updateLeave(id: ID, leave: ID, start: DateTime, end: DateTime): LeaveAssignment
        removeLeave(id: ID, leave: ID): LeaveAssignment
    }

    type HiveUser @key(selectionSet: "{ id }"){
        id: ID,
        leave(where: LeaveWhere): [LeaveAssignment]
    }

    input LeaveWhere {
        start_LTE: DateTime
        end_GTE: DateTime
    }

    type LeaveAssignment {
        id: ID
        start: DateTime
        end: DateTime
        user: HiveUser
        createdAt: DateTime
        createdBy: HiveUser
    }
        
    type SkillAssignment {
        id: ID
        user: HiveUser
        skill: String
        skillData: JSON
    }

    input AssignedWhere {
        archived: Boolean
        status: [String]
        start: DateTime
        end: DateTime
        displayId: String
    }
    
`
    return {
        typeDefs,
        resolvers
    }
}
