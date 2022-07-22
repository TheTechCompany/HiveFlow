import { PrismaClient } from "@prisma/client"
import { nanoid } from "nanoid";
import { request } from 'graphql-request'
import path from 'path'
import FormData from 'form-data';

import axios from 'axios';
import { gql, ApolloClient, InMemoryCache } from '@apollo/client/core'
import fetch from "cross-fetch";
import { createUploadLink } from 'apollo-upload-client'

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
                // console.log({data})
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
                        
					},
                    include: {
                        tasks: {
                            include: {
                                dependencyOf: true,
                                dependencyOn: true
                            }
                        }
                    }
				})

				return result.map((x) => ({
					...x,
                    tasks: x.tasks.map((task) => ({
                        ...task,
                        createdBy: task.createdBy ? {id: task.createdBy} : undefined,
                        members: task.members?.map((member) => ({id: member}))
                    })),
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
								displayId: args.input.id || `${count + 1}`,
								name: args.input.name,
								organisation: context.jwt.organisation,
								startDate: args.input.startDate || new Date(),
								endDate: args.input.endDate || new Date(),
								status: args.input.status || 'draft'
							}
						})
						return project
					}
				)

            },
            updateProject: async (root: any, args: any, context: any) => {
                return await prisma.project.update({
                    where: {
                        organisation_displayId: {
                            displayId: args.id,
                            organisation: context.jwt.organisation
                        }
                    },
                    data: {
                        name: args.input.name,
                        startDate: args.input.startDate,
                        endDate: args.input.endDate,
                        status: args.input.status
                    }
                })
            },
            deleteProject: async (root: any, args: any, context: any) => {
                return await prisma.project.delete({where: {organisation_displayId: {organisation: context.jwt.organisation, displayId: args.id}}})
            },
            createProjectTask: async (root: any, args: any, context: any) => {
                return await prisma.project.update({
                    where: {
                        organisation_displayId: {
                            organisation: context?.jwt?.organisation,
                            displayId: args.input.projectId
                        }
                    },
                    data: {
                        tasks: {
                            create: {
                                id: nanoid(),
                                title: args.input.title,
                                description: args.input.description,
                                createdBy: context?.jwt?.id,
                                members: args.input.members || [],
                                startDate: args.input.startDate,
                                endDate: args.input.endDate,
                                status: args.input.status,
                                lastUpdated: new Date()
                            }
                        }
                    }
                })
            },
            updateProjectTask: async (root: any, args: any) => {
                let projectId;
                if(args.input.projectId) {
                    const p = await prisma.project.findFirst({
                        where: {
                            displayId: args.input.projectId
                        }
                    })
                    projectId = p?.id
                }

                return await prisma.projectTask.update({
                    where: {
                        id: args.id
                    },
                    data: {
                        title: args.input.title,
                        description: args.input.description,
                        members: args.input.members || [],
                        startDate: args.input.startDate,
                        endDate: args.input.endDate,
                        status: args.input.status,
                        projectId: projectId,
                        lastUpdated: new Date()
                    }
                })
            },
            deleteProjectTask: async (root: any, args: any) => {
                return await prisma.projectTask.delete({where: {id: args.id}})
            },
            createProjectTaskDependency: async (root: any, args: any, context: any) => {

                return await prisma.project.update({
                    where: {
                        organisation_displayId: {
                            organisation: context?.jwt?.organisation,
                            displayId: args.project
                        }
                    },
                    data: {
                        tasks: {
                            update: [{
                                where: {
                                    id: args.source,
                                },
                                data: {
                                    dependencyOf: {
                                        connect: {
                                            id: args.target
                                        }
                                    }
                                }
                            
                            }]
                        }
                    }
                })
            },
            deleteProjectTaskDependency: async (root: any, args: any, context: any) => {
                return await prisma.project.update({
                    where: {
                        organisation_displayId: {
                            organisation: context?.jwt?.organisation,
                            displayId: args.project
                        }
                    },
                    data: {
                        tasks: {
                            update: [{
                                where: {
                                    id: args.source,
                                },
                                data: {
                                    dependencyOf: {
                                        disconnect: {
                                            id: args.target
                                        }
                                    }
                                }
                            
                            }]
                        }
                    }
                })
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
                // console.log({data})
                return data.createDirectory;
            },
            updateProjectFolder: async () => {

            },
            uploadProjectFiles: async (root: any, args: {project: string, files: any[], path: string}, context: any) => {
                
                const uploadLink = createUploadLink({
                    uri: context.gatewayUrl,
                    fetch: fetch,
                    headers: {
                        'X-Hive-JWT': `${context.token}`,
				
                        'Authorization': `Bearer ${context.token}`
                    }
                })
                const client = new ApolloClient({
                    link: uploadLink,
                    cache: new InMemoryCache()
                })

                const appPath = `/Application Data/Flow/${args.project}`
                const dataPath = path.join(appPath, args.path)


                const files = await Promise.all(args.files?.map(async (file: any) => {
                    const { createReadStream, filename } = await file;
                    
                    const fileData = await new Promise<Buffer>((resolve, reject) => {
                        const readStream = createReadStream();
                        const buffers: Buffer[] = [];

                        readStream.on('error', reject)
            
                        readStream.on('data', (data: Buffer) => {
                            buffers.push(data)
                        })
            
                        readStream.on('end', () => {
                            resolve(Buffer.concat(buffers))
                        })
                    })
                    return {name: filename, data: fileData}
                }))

				const fileQuery = gql`
					mutation UploadProjectFiles ($files: [Upload!]) {
						uploadFiles(path: "${dataPath}", files: $files){
                            id
                            name
                        }
					}
				`

                // new File()

                // console.log({dataPath, files})

                const formData = new FormData();
   
                formData.append('operations', JSON.stringify({
                    query: fileQuery,
                    variables: {}
                }));
                // formData.append('path', dataPath)

                let map : any = {};
                
                files.forEach((item, ix) => {
                    map[`${ix}`] = [`variables.files.${ix}`]
                })

                formData.append('map', JSON.stringify(map))


                for(var i = 0; i < files.length; i++){

                    // map[`${i}`] = [`variable.files.${i}`]

                    formData.append(`${i}`, files[i].data, {filename: files[i].name})

                    // formData.append("files[]", files[i].data)
                }


                try{
                   const resp = await axios.post(context.gatewayUrl, formData, {
                        headers: {
                            'X-Hive-JWT': `${context.token}`,
                            'Authorization': `Bearer ${context.token}`
                        }
                    })

                    const data = resp.data;

                    console.log({data})
                    // const data = await client.mutate({
                    //     mutation: fileQuery,
                    //     variables: {
                    //         files: files.map((x) => [x.data])
                    //     }
                    // })
                    // console.log({errors: data.errors})
                    return data?.data?.uploadFiles;
                }catch(e){
                    // console.log({e})
                }   

				// const data = await request(context.gatewayUrl, fileQuery, formData, {
                //     // 'Content-Type': 'mulipart/form-data',
				
				// })
               
            },
            moveProjectFile: async (root: any, args: any, context: any) => {
                const appPath = `/Application Data/Flow/${args.project}`
                const dataPath = path.join(appPath, args.path)

                const newPath = path.join(appPath, args.newPath)

                const moveQuery = gql`
                    mutation MoveFile {
                        moveFile(path: "${dataPath}", newPath: "${newPath}"){
                            id
                        }
                    }
                `

                const response = await request(context.gatewayUrl, moveQuery, {}, {
                    'X-Hive-JWT': `${context.token}`,
                    'Authorization': `Bearer ${context.token}`
                })

                return response.moveFile
            },
            renameProjectFile: async (root: any, args: any, context: any) => {
                const appPath = `/Application Data/Flow/${args.project}`
                const dataPath = path.join(appPath, args.path)

                const newPath = path.join(appPath, args.newPath)

                const renameQuery = gql`
                    mutation RenameFile {
                        renameFile(path: "${dataPath}", newName: "${args.newPath}"){
                            id
                        }
                    }
                `
                
                const response = await request(context.gatewayUrl, renameQuery, {}, {
					'X-Hive-JWT': `${context.token}`,
				
                    'Authorization': `Bearer ${context.token}`
				})
                return response.renameFile
            },
            deleteProjectFile: async (root: any, args: any, context: any) => {
                const appPath = `/Application Data/Flow/${args.project}`
                const dataPath = path.join(appPath, args.path)

                const deleteQuery = gql`
                    mutation DeleteFile {
                        deleteFile(path: "${dataPath}"){
                            id
                        }
                    }
                `
                const response = await request(context.gatewayUrl, deleteQuery, {}, {
					'X-Hive-JWT': `${context.token}`,
				
                    'Authorization': `Bearer ${context.token}`
				})
                return response.deleteFile
            }
        }
    }

    const typeDefs = `
    type Query {
        projects(ids: [ID], where: ProjectWhere): [Project!]!
    }

    type Mutation {
        createProject(input: ProjectInput): Project!
		updateProject(id: ID!, input: ProjectInput): Project!
		deleteProject(id: ID!): Project!

        createProjectTask(input: ProjectTaskInput): ProjectTask!
        updateProjectTask(id: ID, input: ProjectTaskInput): ProjectTask!
        deleteProjectTask(id: ID): ProjectTask!

        createProjectTaskDependency(project: ID, source: ID, target: ID): ProjectTask!
        deleteProjectTaskDependency(project: ID, source: ID, target: ID): ProjectTask!

        createProjectFolder(project: ID!, path: String): File
        updateProjectFolder(project: ID!, path: String): File

        moveProjectFile(project: ID!, path: String, newPath: String): File
		uploadProjectFiles(project: ID!, path: String, files: [Upload]): [File!]!
        renameProjectFile(project: ID!, path: String, newPath: String): File
		deleteProjectFile(project: ID!, path: String): File
    }

    input ProjectInput {
        id: ID
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

        tasks: [ProjectTask]

        files(path: String): [File]

        startDate: DateTime
        endDate: DateTime
        status: String
    }

    input ProjectTaskInput {
        title: String
        description: String

        members: [String]

        startDate: DateTime
        endDate: DateTime

        status: String
        
        projectId: String!
    }

    type ProjectTask {
        id: ID!

        title: String
        description: String

        startDate: DateTime
        endDate: DateTime

        status: String

        project: Project

        members: [HiveUser]

        createdBy: HiveUser

        lastUpdated: DateTime

        dependencyOf: [ProjectTask]
        dependencyOn: [ProjectTask]
    }
    
`
    return {
        typeDefs,
        resolvers
    }
}