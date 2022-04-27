import { PrismaClient } from "@prisma/client"

export default (prisma: PrismaClient) => {

    const typeDefs = `
        type Report {
            id: ID
        }
    `

    const resolvers = {};

    return {
        typeDefs,
        resolvers
    }
}