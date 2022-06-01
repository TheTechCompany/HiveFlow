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
            id: ID
            name: String
            registration: String
        }

        type Equipment {
            id: ID! 

            displayId: String

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
               return await prisma.$transaction(async (prisma) => {
					const count = await prisma.equipment.count({ where: {organisation: context.jwt.organisation }})
                    return await prisma.equipment.create({
                        data: {
                            id: nanoid(),
                            displayId: args.input.id || `${count}`,
                            name: args.input.name,
                            registration: args.input.registration,
                            organisation: context.jwt.organisation
                        }
                    })
                })
              
            },
            updateEquipment: async (root: any, args: any, context: any) => {
                return await prisma.equipment.update({
                    where: { displayId_organisation: {displayId: args.id, organisation: context?.jwt?.organisation} },
                    data: {
                        name: args.input.name,
                        registration: args.input.registration,
                        organisation: context.jwt.organisation
                    }
                })
            },
            deleteEquipment: async (root: any, args: any, context: any) => {
                return await prisma.equipment.delete({
                    where: { displayId_organisation: {displayId: args.id, organisation: context.jwt.organisation } }
                })
            }
        }
    };

    return {
        typeDefs,
        resolvers
    }
}