import { PrismaClient } from "@prisma/client"
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

            createEstimateLineItem(estimate: ID, input: EstimateLineItemInput): EstimateLineItem
            updateEstimateLineItem(estimate: ID, id: ID, input: EstimateLineItemInput): EstimateLineItem
            deleteEstimateLineItem(estimate: ID, id: ID): EstimateLineItem
        }

        input EstimateWhere {
            id: String
            displayId: String
            name: String
            status: [String]

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

            organisation: HiveOrganisation
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
                }
                return await prisma.estimate.findMany({where: whereArg, include: {lineItems: true}})
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
                const count = await prisma.estimate.count({ where: {organisation: context.jwt.organisation }})

                return await prisma.estimate.create({
                    data: {
                        id: nanoid(),
                        displayId: args.input.id || `${count + 1}`,
                        name: args.input.name,
                        companyName: args.input.companyName,
                        date: args.input.date || new Date(),
                        expiry: args.input.expiry,
                        status: args.input.status,
                        price: args.input.price,
                        organisation: context.jwt.organisation
                    }
                })
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
                return await prisma.estimate.delete({
                    where: { displayId_organisation: {displayId: args.id, organisation: context.jwt.organisation} }
                })
            } 
        }
    };

    return {
        typeDefs,
        resolvers
    }
}