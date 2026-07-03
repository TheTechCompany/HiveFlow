import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

export default (prisma: PrismaClient) => {

    const typeDefs = `
        type ContinuousImprovement {
            id: ID!
            displayId: String
            title: String!
            description: String
            category: String
            source: String
            status: String!
            priority: String
            impact: String
            rootCause: String
            actionTaken: String
            outcomeMeasured: String
            createdBy: HiveUser
            assignedTo: HiveUser
            createdAt: DateTime!
            updatedAt: DateTime!
            completedAt: DateTime
            organisation: HiveOrganisation
        }

        input ContinuousImprovementInput {
            title: String!
            description: String
            category: String
            source: String
            priority: String
            impact: String
            rootCause: String
            assignedTo: String
        }

        input ContinuousImprovementUpdateInput {
            title: String
            description: String
            category: String
            source: String
            status: String
            priority: String
            impact: String
            rootCause: String
            actionTaken: String
            outcomeMeasured: String
            assignedTo: String
            completedAt: DateTime
        }

        extend type Query {
            continuousImprovements: [ContinuousImprovement!]!
            myContinuousImprovements: [ContinuousImprovement!]!
        }

        extend type Mutation {
            createContinuousImprovement(input: ContinuousImprovementInput!): ContinuousImprovement!
            updateContinuousImprovement(id: ID!, input: ContinuousImprovementUpdateInput!): ContinuousImprovement!
            deleteContinuousImprovement(id: ID!): ContinuousImprovement!
        }
    `;

    const resolvers = {
        ContinuousImprovement: {
            createdBy: async (root: any) => {
                if (!root.createdBy) return null;
                return { id: root.createdBy };
            },
            assignedTo: async (root: any) => {
                if (!root.assignedTo) return null;
                return { id: root.assignedTo };
            },
            organisation: async (root: any) => {
                return { id: root.organisation };
            }
        },
        Query: {
            continuousImprovements: async (_root: any, _args: any, context: any) => {
                return prisma.continuousImprovement.findMany({
                    where: { organisation: context.jwt?.organisation },
                    orderBy: { createdAt: 'desc' }
                });
            },
            myContinuousImprovements: async (_root: any, _args: any, context: any) => {
                return prisma.continuousImprovement.findMany({
                    where: {
                        organisation: context.jwt?.organisation,
                        createdBy: context.jwt?.id
                    },
                    orderBy: { createdAt: 'desc' }
                });
            }
        },
        Mutation: {
            createContinuousImprovement: async (_root: any, args: any, context: any) => {
                const org = context.jwt?.organisation;

                // Generate org-scoped displayId: CI-0001, CI-0002, ...
                // Retry loop handles the rare race where two creates land on the same number.
                const maxAttempts = 3;
                let lastError: any;

                for (let attempt = 0; attempt < maxAttempts; attempt++) {
                    // Use createdAt ordering (not displayId) to avoid lexicographic sort bugs
                    // where CI-0009 > CI-0010 as strings.
                    const last = await prisma.continuousImprovement.findFirst({
                        where: { organisation: org },
                        orderBy: { createdAt: 'desc' },
                        select: { displayId: true }
                    });
                    let nextNum = 1;
                    if (last?.displayId) {
                        const match = last.displayId.match(/^CI-(\d+)$/);
                        if (match) nextNum = parseInt(match[1], 10) + 1;
                    }
                    const displayId = `CI-${String(nextNum).padStart(4, '0')}`;

                    try {
                        return await prisma.continuousImprovement.create({
                            data: {
                                id: nanoid(),
                                displayId,
                                title: args.input.title,
                                description: args.input.description || null,
                                category: args.input.category || null,
                                source: args.input.source || null,
                                priority: args.input.priority || null,
                                impact: args.input.impact || null,
                                rootCause: args.input.rootCause || null,
                                assignedTo: args.input.assignedTo || null,
                                createdBy: context.jwt?.id,
                                organisation: org
                            }
                        });
                    } catch (err: any) {
                        // P2002 = unique constraint violation — another request grabbed this number
                        if (err?.code === 'P2002') {
                            lastError = err;
                            continue; // retry with next number
                        }
                        throw err;
                    }
                }
                throw lastError ?? new Error('Failed to generate unique displayId');
            },
            updateContinuousImprovement: async (_root: any, args: any, context: any) => {
                const existing = await prisma.continuousImprovement.findFirst({
                    where: { id: args.id, organisation: context.jwt?.organisation }
                });
                if (!existing) throw new Error("ContinuousImprovement not found");

                const data: any = { ...args.input };
                if (data.completedAt === null) {
                    // Allow clearing completedAt — treat explicit null as "unset"
                    data.completedAt = null;
                }
                return prisma.continuousImprovement.update({
                    where: { id: args.id },
                    data
                });
            },
            deleteContinuousImprovement: async (_root: any, args: any, context: any) => {
                const existing = await prisma.continuousImprovement.findFirst({
                    where: { id: args.id, organisation: context.jwt?.organisation }
                });
                if (!existing) throw new Error("ContinuousImprovement not found");

                return prisma.continuousImprovement.delete({
                    where: { id: args.id }
                });
            }
        }
    };

    return { typeDefs, resolvers };
};
