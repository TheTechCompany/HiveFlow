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
            price: Float
        }

        type Estimate  {
            id: ID! 
            displayId: String
            companyName: String
            name: String
            status: String
            date: DateTime
            price: Float
            organisation: HiveOrganisation
        }

    `

    const resolvers = {
        Query: {
            estimates: async (root: any, args: any, context: any) => {
                let whereArg : any = {organisation: context.jwt.organisation};

                if(args.where){
                    if(args.where.id) whereArg['id'] = args.where.id
                    if(args.where.status) whereArg['status'] = {in: args.where.status}
                    if(args.where.displayId) whereArg['displayId'] = args.where.displayId;
                }
                return await prisma.estimate.findMany({where: whereArg})
            }
        },
        Mutation: {
            createEstimate: async  (root: any, args: any, context: any) => {
                const count = await prisma.estimate.count({ where: {organisation: context.jwt.organisation }})

                return await prisma.estimate.create({
                    data: {
                        id: nanoid(),
                        displayId: args.input.id || `${count + 1}`,
                        name: args.input.name,
                        companyName: args.input.companyName,
                        date: args.input.date || new Date(),
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