import { PrismaClient, ProjectTask } from "@prisma/client"

export default (prisma: PrismaClient) => {

    const resolvers = {
        AssignedTask: {
            __resolveType: (root) => {
                if(root.projectId) return 'ProjectTask';
                if(root.estimateId) return 'EstimateTask';
            }
        },
        Query: {
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

                // if(args.where?.archived){
                //     where['archived'] = true;
                // }else{
                //     where['archived'] = false;
                // }

                const [ projectTasks, estimateTasks ] = await Promise.all([
                    prisma.projectTask.findMany({
                        where: {
                            ...where,
                            project: {
                                organisation: context?.jwt?.organisation
                            },
                            members: {has: context?.jwt?.id}
                        },
                        include: {
                            project: true
                        }
                    }),
                    prisma.estimateTask.findMany({
                        where: {
                            ...where,
                            estimate: {
                                organisation: context?.jwt?.organisation
                            },
                            members: {has: context?.jwt?.id}
                        },
                        include: {
                            estimate: true
                        }
                    })
                ])

                const taskArray : any[] = projectTasks.concat(estimateTasks as any[])

				return taskArray.map((x) => ({
					...x,
                  
                    createdBy: x.createdBy ? {id: x.createdBy} : undefined,
                    members: x.members?.map((member) => ({id: member})),

					organisation: {id: x.organisation}
				}));            
            }
        },
        
    }

    const typeDefs = `

    union AssignedTask = ProjectTask | EstimateTask

    type Query {
        assignments(ids: [ID], where: AssignedWhere): [AssignedTask!]!
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