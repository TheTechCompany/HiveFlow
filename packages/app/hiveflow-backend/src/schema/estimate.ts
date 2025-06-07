import { EstimateTask, PrismaClient } from "@prisma/client"
// import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { LexoRank } from "lexorank";
import { nanoid } from "nanoid";

export default (prisma: PrismaClient) => {

    const typeDefs = `
        type Query {
			estimates(where: EstimateWhere): [Estimate!]!
        }

        type Mutation {
            createEstimate(input: EstimateInput): Estimate
            updateEstimate(id: ID!, input: EstimateInput): Estimate
            deleteEstimate(id: ID!): Estimate

            createEstimateTask(input: EstimateTaskInput): EstimateTask!
            updateEstimateTask(id: ID, input: EstimateTaskInput): EstimateTask!
            updateEstimateTaskTimelineOrder(id: ID, above: String, below: String): EstimateTask!
            deleteEstimateTask(id: ID): EstimateTask!

            createEstimateTaskDependency(estimate: ID, source: ID, target: ID): EstimateTask!
            deleteEstimateTaskDependency(estimate: ID, source: ID, target: ID): EstimateTask!    

            createEstimateLineItem(estimate: ID, input: EstimateLineItemInput): EstimateLineItem
            updateEstimateLineItem(estimate: ID, id: ID, input: EstimateLineItemInput): EstimateLineItem
            deleteEstimateLineItem(estimate: ID, id: ID): EstimateLineItem
        }

        input EstimateWhere {
            id: String
            displayId: String
            name: String
            status: [String]

            archived: Boolean

            date_GTE: DateTime
            date_LTE: DateTime
        }

        input EstimateInput {
            id: ID
            name: String
            companyName: String
            status: String
            date: DateTime
            expiry: DateTime

            price: Float

            lineItems: [EstimateLineItemInput]
        }

        type Estimate  {
            id: ID! 
            displayId: String
            companyName: String
            name: String
            status: String
            
            date: DateTime
            expiry: DateTime

            price: Float

            lineItems: [EstimateLineItem]

            tasks : [EstimateTask]

            organisation: HiveOrganisation
        }

       
    input EstimateTaskInput {
        title: String
        description: String

        members: [String]

        startDate: DateTime
        endDate: DateTime

        status: String

        above: String
        below: String
        
        estimateId: String
    }

    type EstimateTask {
        id: ID!

        title: String
        description: String

        timelineRank: String
        columnRank: String

        startDate: DateTime
        endDate: DateTime

        status: String

        estimate: Estimate

        members: [HiveUser]

        createdBy: HiveUser

        lastUpdated: DateTime

        dependencyOf: [EstimateTask]
        dependencyOn: [EstimateTask]
    }

        input EstimateLineItemInput {
            order: Int

            item: String
            description: String
            price: Float
            quantity: Float
        }

        type EstimateLineItem {
            id: ID

            order: Int

            item: String
            description: String

            price: Float
            quantity: Float
            amount: Float

        }

    `

    const resolvers = {
        EstimateLineItem: {
            amount: (root: any) => {
                return (root.price || 0) * (root.quantity || 0)
            }
        },
        Query: {
            estimates: async (root: any, args: any, context: any) => {
                let whereArg : any = {organisation: context.jwt.organisation};

                if(args.where){
                    if(args.where.id) whereArg['id'] = args.where.id
                    if(args.where.status) whereArg['status'] = {in: args.where.status}
                    if(args.where.displayId) whereArg['displayId'] = args.where.displayId;
                    if(args.where.date_GTE) whereArg['date'] = {...whereArg['date'], gte: args.where.date_GTE};
                    if(args.where.date_LTE) whereArg['date'] = {...whereArg['date'], lte: args.where.date_LTE};

                    if(args.where.archived) whereArg['archived'] = true;
                    else whereArg['archived'] = false;
                }
                const estimates = await prisma.estimate.findMany({
                    where: whereArg, 
                    include: {
                        lineItems: true, 
                        tasks: {
                            include: {
                                dependencyOf: true,
                                dependencyOn: true
                            }
                        }
                    }
                })

                return estimates.map((estimate) => ({
                    ...estimate,
                    tasks: estimate.tasks.map((task) => ({
                        ...task,
                        createdBy: task.createdBy ? {id: task.createdBy} : undefined,
                        members: task.members?.map((member) => ({id: member}))
                    }))
                }))
            }
        },
        Mutation: {
            createEstimateLineItem: async  (root: any, args: any, context: any) => {
                const id = nanoid();

                const order_count = await prisma.estimateLineItem.count({where: {
                    estimate: {
                        displayId: args.estimate,
                        organisation: context?.jwt?.organisation
                    }
                }})

                const item = await prisma.estimate.update({
                    where: {
                        displayId_organisation: {
                            displayId: args.estimate,
                            organisation: context?.jwt?.organisation
                        }
                    },
                    data: {
                        lineItems: {
                            create: {
                                id: id,
                                order: args.input.order || order_count + 1,
                                item: args.input.item,
                                description: args.input.description,
                                quantity: args.input.quantity,
                                price: args.input.price
                            }
                        }
                    },
                    include: {
                        lineItems: true
                    }
                })
                return item?.lineItems?.find((a) => a.id == id)
            },
            updateEstimateLineItem: async  (root: any, args: any, context: any) => {
                const item = await prisma.estimate.update({
                    where: {
                        displayId_organisation: {
                            displayId: args.estimate,
                            organisation: context?.jwt?.organisation
                        },
                    },
                    data: {
                        lineItems: {
                            update: {
                                where: {id: args.id},
                                data: {
                                    order: args.input.order,
                                    item: args.input.item,
                                    description: args.input.description,
                                    quantity: args.input.quantity,
                                    price: args.input.price
                                }
                            }
                        }
                    },
                    include: {
                        lineItems: true
                    }
                })
                return item?.lineItems?.find((a) => a.id == args.id)
            },
            deleteEstimateLineItem: async  (root: any, args: any, context: any) => {
                const item = await prisma.estimate.update({
                    where: {
                        displayId_organisation: {
                            displayId: args.estimate,
                            organisation: context?.jwt?.organisation
                        }
                    },
                    data: {
                        lineItems: {
                            delete: [{
                                id: args.id
                            }]
                        }
                    },
                    include: {
                        lineItems: true
                    }
                })
                return item?.lineItems?.find((a) => a.id == args.id)
            },
            createEstimate: async  (root: any, args: any, context: any) => {
                try{
                    const count = await prisma.estimate.count({ where: {organisation: context.jwt.organisation }})

                    return await prisma.estimate.create({
                        data: {
                            id: nanoid(),
                            displayId: args.input.id || `${count + 1}`,
                            name: args.input.name,
                            companyName: args.input.companyName,
                            date: args.input.date,
                            expiry: args.input.expiry,
                            status: args.input.status,
                            price: args.input.price,
                            organisation: context.jwt.organisation
                        }
                    })
                }catch(e: any){
                        // if(e instanceof PrismaClientKnownRequestError){
                            if(e.code == 'P2002'){
    
                                throw new Error("Duplicate estimate id")
                            }
                        // }
                }
            },
            updateEstimate: async  (root: any, args: any, context: any) => {
                return await prisma.estimate.update({
                    where: {displayId_organisation: {displayId: args.id, organisation: context.jwt.organisation}},
                    data: {
                        name: args.input.name,
                        date: args.input.date,
                        expiry: args.input.expiry,
                        // lineItems: {}
                        companyName: args.input.companyName,
                        status: args.input.status,
                        price: args.input.price,
                        organisation: context.jwt.organisation
                    }
                })
            },
            deleteEstimate: async  (root: any, args: any, context: any) => {
                return await prisma.estimate.update({
                    where: { displayId_organisation: {displayId: args.id, organisation: context.jwt.organisation} },
                    data: {
                        archived: true
                    }
                })
            },
            createEstimateTask: async (root: any, args: any, context: any) => {

                const {columnRank: lastColumnRank} = await prisma.estimateTask.findFirst({
                    where: {
                        estimate: {
                            organisation: context?.jwt?.organisation,
                            displayId: args.input.estimateId
                        },
                        status: args.input.status
                    },
                    orderBy: {
                        columnRank: 'desc'
                    }
                }) || {};

                const { timelineRank: lastTimelineRank } = await prisma.estimateTask.findFirst({
                    where: {
                        estimate: {
                            organisation: context?.jwt?.organisation,
                            displayId: args.input.estimateId
                        },
                    },
                    orderBy: {
                        timelineRank: 'desc'
                    }
                }) || {};



                let aboveColumnRank = LexoRank.parse(lastColumnRank || LexoRank.min().toString())
                let aboveTimelineRank = LexoRank.parse(lastTimelineRank || LexoRank.min().toString())
                let belowRank = LexoRank.parse(LexoRank.max().toString())

                let nextTimelineRank = aboveTimelineRank.between(belowRank).toString();
                let nextColumnRank = aboveColumnRank.between(belowRank).toString();

                
                return await prisma.estimate.update({
                    where: {
                        displayId_organisation: {
                            organisation: context?.jwt?.organisation,
                            displayId: args.input.estimateId
                        }
                    },
                    data: {
                        tasks: {
                            create: {
                                id: nanoid(),
                                title: args.input.title,
                                description: args.input.description,
                                createdBy: context?.jwt?.id,
                                members: args.input.members || [],
                                columnRank: nextColumnRank,
                                timelineRank: nextTimelineRank,
                                startDate: args.input.startDate,
                                endDate: args.input.endDate,
                                status: args.input.status,
                                lastUpdated: new Date()
                            }
                        }
                    }
                })
            },
            updateEstimateTaskTimelineOrder: async (root: any, args: any, context: any) => {

                const projectRoot = await prisma.estimateTask.findFirst({
                    where: {
                        id: args.id,
                        estimate: {
                            organisation: context?.jwt?.organisation
                        }
                    }
                })
                
                if(!projectRoot) throw new Error("No estimateTask found")

                let aboveTask: EstimateTask | null, belowTask : EstimateTask | null;

                let aboveTimelineRank, belowTimelineRank;

                if(args.above){
                    aboveTask = await prisma.estimateTask.findFirst({
                        where: {
                            id: args.above,
                            estimateId: projectRoot?.estimateId
                        }
                    });
                    aboveTimelineRank = aboveTask?.timelineRank;
                }

                if(args.below){
                    belowTask = await prisma.estimateTask.findFirst({
                        where: {
                            id: args.below,
                            estimateId: projectRoot?.estimateId
                        }
                    })

                    belowTimelineRank = belowTask?.timelineRank;
                }


                let aboveRank = LexoRank.parse(aboveTimelineRank || LexoRank.min().toString())
                let belowRank = LexoRank.parse(belowTimelineRank || LexoRank.max().toString())

                let nextTimelineRank = aboveRank.between(belowRank).toString();

                return await prisma.estimateTask.update({
                    where: {
                        estimateId_id: {
                            id: args.id,
                            estimateId: projectRoot?.estimateId
                        }
                    },
                    data: {
                        timelineRank: nextTimelineRank
                    }
                })


            }, 
            updateEstimateTask: async (root: any, args: any, context: any) => {
                
                const rootTask = await prisma.estimateTask.findFirst({
                    where: {
                        id: args.id,
                        estimate: {
                            organisation: context?.jwt?.organisation
                        }
                    }
                })

                if(!rootTask) throw new Error("No task found");

                let estimateId;
                if(args.input.estimateId) {
                    const p = await prisma.estimate.findFirst({
                        where: {
                            displayId: args.input.estimateId
                        }
                    })
                    estimateId = p?.id
                }


                let nextRank;

                if(args.input?.above || args.input?.below){

                    let aboveColumnRank, belowColumnRank;

                    if(args.input.above){
                        const aboveTask = await prisma.estimateTask.findFirst({
                            where: {
                                id: args.input?.above,
                                estimateId: rootTask?.estimateId
                            }
                        })
                        aboveColumnRank = aboveTask?.columnRank;
                    }

                    if(args.input.below){
                        const belowTask = await prisma.estimateTask.findFirst({
                            where: {
                                id: args.input?.below,
                                estimateId: rootTask?.estimateId
                            }
                        })
                        belowColumnRank = belowTask?.columnRank;
                    }

                    let aboveRank = LexoRank.parse(aboveColumnRank || LexoRank.min().toString())
                    let belowRank = LexoRank.parse(belowColumnRank || LexoRank.max().toString())
                     nextRank = aboveRank.between(belowRank).toString();

                }else if(args.input?.status){
                    const { columnRank } = await prisma.estimateTask.findFirst({
                        where: {
                            estimateId: rootTask?.estimateId,
                            status: args.input?.status
                        },
                        orderBy: {
                            columnRank: 'asc'
                        }
                    }) || {}

                    let aboveRank = LexoRank.parse(columnRank || LexoRank.min().toString())
                    let belowRank = LexoRank.parse(LexoRank.max().toString())
                     nextRank = aboveRank.between(belowRank).toString();
            
                }


                return await prisma.estimateTask.update({
                    where: {
                        id: args.id
                    },
                    data: {
                        title: args.input.title,
                        description: args.input.description,
                        members: args.input.members,
                        startDate: args.input.startDate,
                        endDate: args.input.endDate,
                        columnRank: nextRank,
                        status: args.input.status,
                        estimateId: estimateId,
                        lastUpdated: new Date()
                    }
                })
            },
            deleteEstimateTask: async (root: any, args: any) => {
                return await prisma.estimateTask.delete({where: {id: args.id}})
            },
            createEstimateTaskDependency: async (root: any, args: any, context: any) => {

                return await prisma.estimate.update({
                    where: {
                        displayId_organisation: {
                            organisation: context?.jwt?.organisation,
                            displayId: args.estimate
                        }
                    },
                    data: {
                        tasks: {
                            update: [{
                                where: {
                                    id: args.source,
                                },
                                data: {
                                    dependencyOf: {
                                        connect: {
                                            id: args.target
                                        }
                                    }
                                }
                            
                            }]
                        }
                    }
                })
            },
            deleteEstimateTaskDependency: async (root: any, args: any, context: any) => {
                return await prisma.estimate.update({
                    where: {
                        displayId_organisation: {
                            organisation: context?.jwt?.organisation,
                            displayId: args.estimate
                        }
                    },
                    data: {
                        tasks: {
                            update: [{
                                where: {
                                    id: args.source,
                                },
                                data: {
                                    dependencyOf: {
                                        disconnect: {
                                            id: args.target
                                        }
                                    }
                                }
                            
                            }]
                        }
                    }
                })
            },
        }
    };

    return {
        typeDefs,
        resolvers
    }
}