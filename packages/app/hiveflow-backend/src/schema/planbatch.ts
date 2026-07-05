import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

export default (prisma: PrismaClient) => {

    const typeDefs = `
        type PlanBatch {
            id: ID!
            displayId: String
            title: String
            description: String
            status: String
            project: Project!
            items: [PlanBatchItem!]!
            comments: [BatchComment!]!
            reviewer: String
            createdBy: String
            createdAt: DateTime
            updatedAt: DateTime
            organisation: HiveOrganisation
        }

        type BatchComment {
            id: ID!
            message: String!
            user: HiveUser!
            createdAt: DateTime!
            batch: PlanBatch!
            parent: BatchComment
            parentId: ID
            replies: [BatchComment!]!
        }

        type PlanBatchItem {
            id: ID!
            batch: PlanBatch!
            task: Task!
            parent: PlanBatchItem
            parentItemId: ID
            children: [PlanBatchItem!]!
            scheduledStart: DateTime
            scheduledEnd: DateTime
            estimatedHours: Float
            rank: String
            notes: String
            organisation: HiveOrganisation
        }

        input PlanBatchInput {
            displayId: String
            title: String!
            description: String
            projectId: String!
            reviewer: String
        }

        input PlanBatchUpdateInput {
            title: String
            description: String
            status: String
            reviewer: String
        }

        input PlanBatchItemInput {
            taskId: String!
            parentItemId: ID
            scheduledStart: DateTime
            scheduledEnd: DateTime
            estimatedHours: Float
            notes: String
        }

        input PlanBatchItemUpdateInput {
            parentItemId: ID
            scheduledStart: DateTime
            scheduledEnd: DateTime
            estimatedHours: Float
            rank: String
            notes: String
        }

        extend type Project {
            planBatches: [PlanBatch!]!
        }

        extend type Query {
            planBatches(projectId: String): [PlanBatch!]!
            planBatch(id: ID!): PlanBatch
        }

        extend type Mutation {
            createPlanBatch(input: PlanBatchInput!): PlanBatch!
            updatePlanBatch(id: ID!, input: PlanBatchUpdateInput!): PlanBatch!
            deletePlanBatch(id: ID!): PlanBatch!
            addPlanBatchItem(batchId: ID!, input: PlanBatchItemInput!): PlanBatchItem!
            updatePlanBatchItem(id: ID!, input: PlanBatchItemUpdateInput!): PlanBatchItem!
            removePlanBatchItem(id: ID!): PlanBatchItem!
            commentOnBatch(batchId: ID!, message: String!, parentId: ID): BatchComment!
            removeBatchComment(id: ID!): BatchComment!
        }
    `;

    const resolvers = {
        Project: {
            planBatches: async (root: any, args: any, context: any) => {
                return prisma.planBatch.findMany({
                    where: {
                        projectId: root.id,
                        organisation: context.jwt?.organisation
                    },
                    include: {
                        items: {
                            include: { task: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                });
            }
        },
        PlanBatch: {
            project: async (root: any) => {
                return prisma.project.findUnique({ where: { id: root.projectId } });
            },
            items: async (root: any) => {
                return prisma.planBatchItem.findMany({
                    where: { batchId: root.id },
                    include: { task: true },
                    orderBy: { rank: 'asc' }
                });
            },
            comments: async (root: any) => {
                return prisma.batchComment.findMany({
                    where: { batchId: root.id, parentId: null },
                    orderBy: { createdAt: 'asc' },
                    include: {
                        replies: {
                            orderBy: { createdAt: 'asc' },
                            include: {
                                replies: {
                                    orderBy: { createdAt: 'asc' },
                                },
                            },
                        },
                    },
                });
            },
            organisation: async (root: any) => {
                return { id: root.organisation };
            }
        },
        BatchComment: {
            user: async (root: any) => {
                return { id: root.user };
            },
            batch: async (root: any) => {
                return prisma.planBatch.findUnique({ where: { id: root.batchId } });
            },
            parent: async (root: any) => {
                if (!root.parentId) return null;
                return prisma.batchComment.findUnique({ where: { id: root.parentId } });
            },
            replies: async (root: any) => {
                return prisma.batchComment.findMany({
                    where: { parentId: root.id },
                    orderBy: { createdAt: 'asc' },
                });
            },
        },
        PlanBatchItem: {
            batch: async (root: any) => {
                return prisma.planBatch.findUnique({ where: { id: root.batchId } });
            },
            task: async (root: any) => {
                return prisma.task.findUnique({ where: { id: root.taskId } });
            },
            parent: async (root: any) => {
                if (!root.parentItemId) return null;
                return prisma.planBatchItem.findUnique({
                    where: { id: root.parentItemId },
                    include: { task: true },
                });
            },
            children: async (root: any) => {
                return prisma.planBatchItem.findMany({
                    where: { parentItemId: root.id },
                    include: { task: true },
                    orderBy: { rank: 'asc' },
                });
            },
            organisation: async (root: any) => {
                return { id: root.organisation };
            }
        },
        Query: {
            planBatches: async (root: any, args: any, context: any) => {
                const where: any = { organisation: context.jwt?.organisation };
                if (args.projectId) where.projectId = args.projectId;
                return prisma.planBatch.findMany({
                    where,
                    include: {
                        items: {
                            where: { parentItemId: null },
                            include: { task: true },
                            orderBy: { rank: 'asc' },
                        },
                        project: true
                    },
                    orderBy: { createdAt: 'desc' }
                });
            },
            planBatch: async (root: any, args: any, context: any) => {
                return prisma.planBatch.findFirst({
                    where: {
                        id: args.id,
                        organisation: context.jwt?.organisation
                    },
                    include: {
                        items: {
                            where: { parentItemId: null },
                            include: {
                                task: true,
                                children: {
                                    include: {
                                        task: true,
                                        children: {
                                            include: {
                                                task: true,
                                                children: {
                                                    include: { task: true },
                                                    orderBy: { rank: 'asc' },
                                                },
                                            },
                                            orderBy: { rank: 'asc' },
                                        },
                                    },
                                    orderBy: { rank: 'asc' },
                                },
                            },
                            orderBy: { rank: 'asc' },
                        },
                        project: true
                    }
                });
            }
        },
        Mutation: {
            createPlanBatch: async (root: any, args: any, context: any) => {
                const { displayId, title, description, projectId, reviewer } = args.input;
                const org = context.jwt?.organisation;

                const project = await prisma.project.findFirst({
                    where: { displayId: projectId, organisation: org }
                });
                if (!project) throw new Error("Project not found");

                return prisma.planBatch.create({
                    data: {
                        id: nanoid(),
                        displayId: displayId || undefined,
                        title,
                        description,
                        status: "draft",
                        projectId: project.id,
                        reviewer,
                        createdBy: context.jwt?.id,
                        organisation: org
                    },
                    include: {
                        items: { include: { task: true } },
                        project: true
                    }
                });
            },
            updatePlanBatch: async (root: any, args: any, context: any) => {
                return prisma.planBatch.update({
                    where: { id: args.id },
                    data: {
                        ...args.input,
                        updatedAt: new Date()
                    },
                    include: {
                        items: { include: { task: true } },
                        project: true
                    }
                });
            },
            deletePlanBatch: async (root: any, args: any, context: any) => {
                return prisma.planBatch.delete({
                    where: { id: args.id },
                    include: {
                        items: { include: { task: true } },
                        project: true
                    }
                });
            },
            addPlanBatchItem: async (root: any, args: any, context: any) => {
                const batch = await prisma.planBatch.findFirst({
                    where: { id: args.batchId, organisation: context.jwt?.organisation }
                });
                if (!batch) throw new Error("Batch not found");

                const { taskId, parentItemId, scheduledStart, scheduledEnd, estimatedHours, notes } = args.input;

                const lastItem = await prisma.planBatchItem.findFirst({
                    where: { batchId: args.batchId },
                    orderBy: { rank: 'desc' }
                });

                return prisma.planBatchItem.create({
                    data: {
                        id: nanoid(),
                        batchId: args.batchId,
                        taskId,
                        parentItemId: parentItemId || null,
                        scheduledStart,
                        scheduledEnd,
                        estimatedHours,
                        rank: String((parseInt(lastItem?.rank || '0') + 1)),
                        notes,
                        organisation: context.jwt?.organisation
                    },
                    include: { task: true }
                });
            },
            updatePlanBatchItem: async (root: any, args: any, context: any) => {
                return prisma.planBatchItem.update({
                    where: { id: args.id },
                    data: args.input,
                    include: { task: true }
                });
            },
            removePlanBatchItem: async (root: any, args: any, context: any) => {
                return prisma.planBatchItem.delete({
                    where: { id: args.id },
                    include: { task: true }
                });
            },
            commentOnBatch: async (root: any, args: any, context: any) => {
                const batch = await prisma.planBatch.findFirst({
                    where: { id: args.batchId, organisation: context.jwt?.organisation }
                });
                if (!batch) throw new Error("Batch not found");

                return prisma.batchComment.create({
                    data: {
                        id: nanoid(),
                        message: args.message,
                        user: context.jwt?.id,
                        batchId: args.batchId,
                        parentId: args.parentId || null,
                    },
                });
            },
            removeBatchComment: async (root: any, args: any, context: any) => {
                return prisma.batchComment.delete({
                    where: { id: args.id },
                });
            }
        }
    };

    return { typeDefs, resolvers };
};
