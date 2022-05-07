import { PrismaClient } from "@prisma/client"
import { nanoid } from "nanoid";
import { gql, request } from 'graphql-request'
import path from 'path'

export default (prisma: PrismaClient) => {
    
    const resolvers = {
        Project: {
            files: async (root: any, args: any, context: any) => {
                const appPath = `/Application Data/Flow/${root.displayId}`
                const dataPath = path.join(appPath, args.path)
				const fileQuery = gql`
					{
						files(path: "${dataPath}") {
							id
							name
						}
					}
				`

				const data = await request(context.gatewayUrl, fileQuery, {}, {
					'X-Hive-JWT': `${context.token}`,
				
                    'Authorization': `Bearer ${context.token}`
				})
                console.log({data})
                return data.files;
            }
        },
        Query: {
            projects: async (root: any, args: any, context: any)=> {
                let where : any = {};
				if(args.where?.start){
					where.startDate = { lt: args.where.start };
				}
				if(args.where?.end){
					where.endDate = { gt: args.where.end };
				}

                if(args.where?.status){
                    where.status = {in: args.where.status}
                }

				if(args.ids){
					where['id'] = {in: args.ids}
				}

                if(args.where?.displayId){
                    where['displayId'] = args.where.displayId
                }

				const result = await prisma.project.findMany({
					where: {
						organisation: context.jwt.organisation,
						...where,
                        
					}
				})

				return result.map((x) => ({
					...x,
					organisation: {id: x.organisation}
				}));            
            }
        },
        Mutation: {
			createProject: async (root: any, args: {input: any}, context: any) => {
                return await prisma.$transaction(
					async (prisma) => {
						const count = await prisma.project.count({ where: {organisation: context.jwt.organisation }})

						const project = prisma.project.create({
							data: {
                                id: nanoid(),
								displayId: `${count + 1}`,
								name: args.input.name,
								organisation: context.jwt.organisation,
								startDate: new Date(),
								endDate: new Date(),
								status: args.input.status || 'draft'
							}
						})
						return project
					}
				)

            },
            updateProject: async () => {
                
            },
            deleteProject: async () => {

            },
            createProjectFolder: async (root: any, args: any, context: any) => {
                const appPath = `/Application Data/Flow/${args.project}`
                const dataPath = path.join(appPath, args.path)

				const fileQuery = gql`
					mutation CreateProjectFolder {
						createDirectory(path: "${dataPath}", recursive: true){
                            id
                        }
					}
				`

				const data = await request(context.gatewayUrl, fileQuery, {}, {
					'X-Hive-JWT': `${context.token}`,
				
                    'Authorization': `Bearer ${context.token}`
				})
                console.log({data})
                return data.createDirectory;
            },
            updateProjectFolder: async () => {

            },
            uploadProjectFiles: async () => {

            },
            deleteProjectFile: async () => {

            }
        }
    }

    const typeDefs = `
    type Query {
        projects(ids: [ID], where: ProjectWhere): [Project!]!
    }

    type Mutation {
        createProject(input: ProjectInput): Project!
		updateProject(id: ID!, update: ProjectInput): Project!
		deleteProject(id: ID!): Project!

        createProjectFolder(project: ID!, path: String): File
        updateProjectFolder(project: ID!, path: String): File

		uploadProjectFiles(project: ID!, path: String): [File!]!
		deleteProjectFile(project: ID!, path: String): Boolean
    }

    input ProjectInput {
        name: String
        startDate: DateTime
        endDate: DateTime
        status: String
    }

    input ProjectWhere {
        status: [String]
        start: DateTime
        end: DateTime
        displayId: String
    }

    type Project {
        id: ID! 

        displayId: String
        name: String
        
        organisation: HiveOrganisation
        
        schedule: [ScheduleItem!]! 
        plan: [TimelineItem!]!

        files(path: String): [File]

        startDate: DateTime
        endDate: DateTime
        status: String
    }
`
    return {
        typeDefs,
        resolvers
    }
}