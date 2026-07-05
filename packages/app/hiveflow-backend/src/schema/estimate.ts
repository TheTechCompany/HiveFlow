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
        Estimate: {
            tasks: async (root: any) => {
                return prisma.task.findMany({
                    where: { estimateId: root.id },
                    include: {
                        dependencyOf: true,
                        dependencyOn: true,
                    },
                });
            },
        },
    }

    const typeDefs = `
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
