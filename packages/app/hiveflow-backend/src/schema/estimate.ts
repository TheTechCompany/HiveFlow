import { PrismaClient } from "@prisma/client"
import { nanoid } from "nanoid";

/**
 * Estimate-specific resolvers.
 *
 * Task-level mutations (createEstimateTask, updateEstimateTask, etc.) are
 * handled by the unified Task mutations in project.ts.  This file provides
 * the Estimate/EstimateLineItem CRUD, the EstimateTask type alias, and
 * estimate-scoped queries.
 */
export default (prisma: PrismaClient) => {

    const resolvers = {
        Query: {
            estimates: async (root: any, args: any, context: any) => {
                const where: any = { organisation: context?.jwt?.organisation };
                if (args.where?.displayId) {
                    where.displayId = args.where.displayId;
                }
                return prisma.estimate.findMany({ where });
            },
        },
        Mutation: {
            createEstimate: async (root: any, args: any, context: any) => {
                try {
                    const count = await prisma.estimate.count({ where: { organisation: context.jwt.organisation } });
                    return await prisma.estimate.create({
                        data: {
                            id: nanoid(),
                            displayId: args.input.id || `${count + 1}`,
                            name: args.input.name,
                            companyName: args.input.companyName,
                            date: args.input.date,
                            expiry: args.input.expiry,
                            status: args.input.status || 'draft',
                            price: args.input.price,
                            managers: args.input.managers || [],
                            organisation: context.jwt.organisation,
                        },
                    });
                } catch (e: any) {
                    if (e.code == 'P2002') {
                        throw new Error("Duplicate estimate id");
                    }
                }
            },
            updateEstimate: async (root: any, args: any, context: any) => {
                return await prisma.estimate.update({
                    where: {
                        displayId_organisation: {
                            displayId: args.id,
                            organisation: context.jwt.organisation,
                        },
                    },
                    data: {
                        name: args.input.name,
                        companyName: args.input.companyName,
                        date: args.input.date,
                        expiry: args.input.expiry,
                        status: args.input.status,
                        price: args.input.price,
                        managers: args.input.managers || [],
                    },
                });
            },
            deleteEstimate: async (root: any, args: any, context: any) => {
                return await prisma.estimate.update({
                    where: {
                        displayId_organisation: {
                            displayId: args.id,
                            organisation: context.jwt.organisation,
                        },
                    },
                    data: {
                        archived: true,
                    },
                });
            },
            createEstimateLineItem: async (root: any, args: any, context: any) => {
                const id = nanoid();
                const orderCount = await prisma.estimateLineItem.count({
                    where: {
                        estimate: {
                            displayId: args.estimate,
                            organisation: context?.jwt?.organisation,
                        },
                    },
                });
                const item = await prisma.estimate.update({
                    where: {
                        displayId_organisation: {
                            displayId: args.estimate,
                            organisation: context?.jwt?.organisation,
                        },
                    },
                    data: {
                        lineItems: {
                            create: {
                                id,
                                order: args.input.order ?? orderCount + 1,
                                item: args.input.item,
                                description: args.input.description,
                                quantity: args.input.quantity,
                                price: args.input.price,
                            },
                        },
                    },
                    include: { lineItems: true },
                });
                return item?.lineItems?.find((a: any) => a.id === id);
            },
            updateEstimateLineItem: async (root: any, args: any, context: any) => {
                const item = await prisma.estimate.update({
                    where: {
                        displayId_organisation: {
                            displayId: args.estimate,
                            organisation: context?.jwt?.organisation,
                        },
                    },
                    data: {
                        lineItems: {
                            update: {
                                where: { id: args.id },
                                data: {
                                    order: args.input.order,
                                    item: args.input.item,
                                    description: args.input.description,
                                    quantity: args.input.quantity,
                                    price: args.input.price,
                                },
                            },
                        },
                    },
                    include: { lineItems: true },
                });
                return item?.lineItems?.find((a: any) => a.id === args.id);
            },
            deleteEstimateLineItem: async (root: any, args: any, context: any) => {
                const item = await prisma.estimate.update({
                    where: {
                        displayId_organisation: {
                            displayId: args.estimate,
                            organisation: context?.jwt?.organisation,
                        },
                    },
                    data: {
                        lineItems: {
                            delete: { id: args.id },
                        },
                    },
                    include: { lineItems: true },
                });
                return item?.lineItems?.find((a: any) => a.id === args.id);
            },
        },
        Estimate: {
            tasks: async (root: any) => {
                return prisma.task.findMany({
                    where: { estimateId: root.id },
                    include: {
                        dependencyOf: true,
                        dependencyOn: true,
                        children: true,
                        parent: true,
                    },
                });
            },
        },
        EstimateLineItem: {
            amount: (root: any) => {
                return (root.quantity ?? 0) * (root.price ?? 0);
            },
        },
    }

    const typeDefs = `
        input EstimateWhere {
            displayId: String
        }

        input EstimateInput {
            id: ID
            name: String
            companyName: String
            status: String
            date: DateTime
            expiry: DateTime
            price: Float
            managers: [String]
        }

        input EstimateLineItemInput {
            order: Int
            item: String
            description: String
            price: Float
            quantity: Float
        }

        extend type Query {
            estimates(where: EstimateWhere): [Estimate]
        }

        extend type Mutation {
            createEstimate(input: EstimateInput): Estimate
            updateEstimate(id: ID!, input: EstimateInput): Estimate
            deleteEstimate(id: ID!): Estimate
            createEstimateLineItem(estimate: ID!, input: EstimateLineItemInput!): EstimateLineItem
            updateEstimateLineItem(estimate: ID!, id: ID!, input: EstimateLineItemInput!): EstimateLineItem
            deleteEstimateLineItem(estimate: ID!, id: ID!): EstimateLineItem
        }

        type Estimate {
            id: ID!
            displayId: String
            companyName: String
            name: String
            status: String
            date: DateTime
            expiry: DateTime
            price: Float
            lineItems: [EstimateLineItem]
            tasks: [Task]
            organisation: HiveOrganisation
            managers: [HiveUser]
        }

        type EstimateLineItem {
            id: ID!
            order: Int
            item: String
            description: String
            quantity: Float
            price: Float
            amount: Float
        }

        # EstimateTask is now an alias for Task (backward compat)
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
            requiredSkills: JSON
            taskType: String
            category: String
            createdBy: HiveUser
            handoverNote: String
            lastUpdated: DateTime
            dependencyOf: [Task]
            dependencyOn: [Task]
        }
    `

    return {
        typeDefs,
        resolvers
    }
}
