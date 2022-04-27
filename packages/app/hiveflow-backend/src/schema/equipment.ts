import { PrismaClient } from "@prisma/client"
import { nanoid } from "nanoid";

export default (prisma: PrismaClient) => {

    const typeDefs = `
    
        type Query {
            equipment: [Equipment]
        }

        type Mutation {
            createEquipment(input: EquipmentInput): Equipment
            updateEquipment(id: ID, input: EquipmentInput): Equipment
            deleteEquipment(id: ID): Equipment
        }

        input EquipmentInput {
            name: String
            registration: String
        }

        type Equipment {
            id: ID! 
            name: String
            registration: String

            organisation: HiveOrganisation
        }
    `

    const resolvers = {
        Query: {
            equipment: async (root: any, args: any, context: any) => {
                return await prisma.equipment.findMany({where: {organisation: context.jwt.organisation}})
            }
        },
        Mutation: {
            createEquipment: async (root: any, args: any, context: any) => {
                return await prisma.equipment.create({
                    data: {
                        id: nanoid(),
                        name: args.input.name,
                        registration: args.input.registration,
                        organisation: context.jwt.organisation
                    }
                })
            },
            updateEquipment: async (root: any, args: any, context: any) => {
                return await prisma.equipment.update({
                    where: {id: args.id},
                    data: {
                        name: args.input.name,
                        registration: args.input.registration,
                        organisation: context.jwt.organisation
                    }
                })
            },
            deleteEquipment: async (root: any, args: any, context: any) => {
                return await prisma.equipment.delete({
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