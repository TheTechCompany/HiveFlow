import { PrismaClient } from "@prisma/client"
import { nanoid } from "nanoid";

export default (prisma: PrismaClient) => {

    const typeDefs = `
        type Query {
			estimates(where: EstimateWhere): [Estimate!]!
        }

        type Mutation {
            createEstimate(input: EstimateInput): Estimate
            updateEstimate(id: ID, input: EstimateInput): Estimate
            deleteEstimate(id: ID): Estimate
        }

        input EstimateWhere {
            id: String
            name: String
            status: [String]
        }

        input EstimateInput {
            name: String
            status: String
            date: DateTime
            price: Float
        }

        type Estimate  {
            id: ID! 
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
                }
                return await prisma.estimate.findMany({where: whereArg})
            }
        },
        Mutation: {
            createEstimate: async  (root: any, args: any, context: any) => {
                return await prisma.estimate.create({
                    data: {
                        id: nanoid(),
                        name: args.input.name,
                        status: args.input.status,
                        price: args.input.price,
                        organisation: context.jwt.organisation
                    }
                })
            },
            updateEstimate: async  (root: any, args: any, context: any) => {
                return await prisma.estimate.update({
                    where: {id: args.id},
                    data: {
                        name: args.input.name,
                        status: args.input.status,
                        price: args.input.price,
                        organisation: context.jwt.organisation
                    }
                })
            },
            deleteEstimate: async  (root: any, args: any, context: any) => {
                return await prisma.estimate.delete({
                    where: {id: args.id}
                })
            } 
        }
    };

    return {
        typeDefs,
        resolvers
    }
}