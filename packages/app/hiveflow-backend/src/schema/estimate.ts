import { PrismaClient } from "@prisma/client"

/**
 * Estimate-specific resolvers.
 *
 * With the unified Task model, estimate CRUD is handled by the unified
 * mutations in project.ts.  This file provides the backward-compatible
 * EstimateTask GraphQL type alias and estimate-scoped queries.
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

        extend type Query {
            estimates(where: EstimateWhere): [Estimate]
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
