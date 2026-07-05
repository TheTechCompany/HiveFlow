import { PrismaClient } from "@prisma/client"
import { nanoid } from "nanoid";
import { request } from 'graphql-request'
import path from 'path'
import FormData from 'form-data';

import axios from 'axios';``
import { LexoRank } from "lexorank";
import { ensureGeneratedTasks } from "../utils/recurring";
// import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
// import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export default (prisma: PrismaClient) => {

    const resolvers = {
        Project: {
            files: async (root: any, args: any, context: any) => {
                const appPath = `/Application Data/Flow/${root.displayId}`
                const dataPath = path.join(appPath, args.path)
				const fileQuery = `
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

                if(args.where?.archived){
                    where['archived'] = true;
                }else{
                    where['archived'] = false;
                }

				const result = await prisma.project.findMany({
					where: {
						organisation: context.jwt.organisation,
						...where  
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
		    managers: x.managers?.map((manager) => ({id: manager})),
					organisation: {id: x.organisation}
				}));            
            }
        },
        Mutation: {
			createProject: async (root: any, args: {input: any}, context: any) => {
                try{
                    return await prisma.$transaction(
                        async (prisma) => {
                            const count = await prisma.project.count({ where: {organisation: context.jwt.organisation }})

                            const project = prisma.project.create({
                                data: {
                                    id: nanoid(),
                                    displayId: args.input.id || `${count + 1}`,
                                    name: args.input.name,
                                    colour: args.input.colour,
                                    organisation: context.jwt.organisation,
                                    description: args.input.description,
                                    startDate: args.input.startDate,
                                    endDate: args.input.endDate,
                                    status: args.input.status || 'draft',
                                    managers: args.input.managers?.length ? args.input.managers : [context.jwt.id]
                                }
                            })
                            return project
                        }
                    )
                }catch(e: any){
                    // if(e instanceof PrismaClientKnownRequestError){
                        if(e.code == 'P2002'){

                            throw new Error("Duplicate job id")
                        }
                    // }
                }

            },
            updateProject: async (root: any, args: any, context: any) => {
                return await prisma.project.update({
                    where: {
                        organisation_displayId: {
                            displayId: args.input.id,
                            organisation: context.jwt.organisation
                        }
                    },
                    data: {
                        name: args.input.name,
                        colour: args.input.colour,
                        startDate: args.input.startDate,
                        endDate: args.input.endDate,
                        description: args.input.description,
                        status: args.input.status,
                        managers: args.input.managers || []
                    }
                })
            },
            deleteProject: async (root: any, args: any, context: any) => {
                return await prisma.project.update({
                    where: {
                        organisation_displayId: {organisation: context.jwt.organisation, displayId: args.id}
                    },
                    data: {
                        archived: true
                    }
                })
            },
            // ── Unified Task mutations ──────────────────────────

            createTask: async (root: any, args: any, context: any) => {
                // Standalone task (no project/estimate) — subtasks etc.
                if (!args.input.projectId && !args.input.estimateId) {
                    return await prisma.task.create({
                        data: {
                            id: nanoid(),
                            title: args.input.title,
                            description: args.input.description,
                            createdBy: context?.jwt?.id,
                            members: args.input.members || [],
                            requiredSkills: args.input.requiredSkills,
                            startDate: args.input.startDate,
                            endDate: args.input.endDate,
                            status: args.input.status || 'Backlog',
                            taskType: args.input.taskType || 'task',
                            category: args.input.category,
                            recurringEventId: args.input.recurringEventId,
                            parentId: args.input.parentId || undefined,
                            lastUpdated: new Date(),
                        },
                    });
                }

                // ── Create under a project ──────────────────────
                if (args.input.projectId) {
                    const {columnRank: lastColumnRank} = await prisma.task.findFirst({
                        where: {
                            project: { organisation: context?.jwt?.organisation, displayId: args.input.projectId },
                            status: args.input.status
                        },
                        orderBy: { columnRank: 'desc' }
                    }) || {};

                    const { timelineRank: lastTimelineRank } = await prisma.task.findFirst({
                        where: {
                            project: { organisation: context?.jwt?.organisation, displayId: args.input.projectId },
                        },
                        orderBy: { timelineRank: 'desc' }
                    }) || {};

                    let aboveColumnRank = LexoRank.parse(lastColumnRank || LexoRank.min().toString())
                    let aboveTimelineRank = LexoRank.parse(lastTimelineRank || LexoRank.min().toString())
                    let belowRank = LexoRank.parse(LexoRank.max().toString())

                    return await prisma.project.update({
                        where: {
                            organisation_displayId: { organisation: context?.jwt?.organisation, displayId: args.input.projectId }
                        },
                        data: {
                            tasks: {
                                create: {
                                    id: nanoid(),
                                    title: args.input.title,
                                    description: args.input.description,
                                    createdBy: context?.jwt?.id,
                                    members: args.input.members || [],
                                    requiredSkills: args.input.requiredSkills,
                                    columnRank: aboveColumnRank.between(belowRank).toString(),
                                    timelineRank: aboveTimelineRank.between(belowRank).toString(),
                                    startDate: args.input.startDate,
                                    endDate: args.input.endDate,
                                    status: args.input.status,
                                    taskType: args.input.taskType || 'task',
                                    category: args.input.category,
                                    recurringEventId: args.input.recurringEventId,
                                    parentId: args.input.parentId || undefined,
                                    lastUpdated: new Date()
                                }
                            }
                        }
                    })
                }

                // ── Create under an estimate ────────────────────
                if (args.input.estimateId) {
                    return await prisma.task.create({
                        data: {
                            id: nanoid(),
                            title: args.input.title,
                            description: args.input.description,
                            createdBy: context?.jwt?.id,
                            members: args.input.members || [],
                            requiredSkills: args.input.requiredSkills,
                            startDate: args.input.startDate,
                            endDate: args.input.endDate,
                            status: args.input.status || 'Backlog',
                            taskType: args.input.taskType || 'task',
                            category: args.input.category,
                            recurringEventId: args.input.recurringEventId,
                            parentId: args.input.parentId || undefined,
                            estimateId: args.input.estimateId,
                            lastUpdated: new Date(),
                        },
                    });
                }
            },

            updateTaskTimelineOrder: async (root: any, args: any, context: any) => {
                const taskRoot = await prisma.task.findFirst({
                    where: { id: args.id, project: { organisation: context?.jwt?.organisation } }
                })
                if(!taskRoot) throw new Error("No task found")

                let aboveTimelineRank, belowTimelineRank;
                if(args.above){
                    const aboveTask = await prisma.task.findFirst({ where: { id: args.above, projectId: taskRoot?.projectId } });
                    aboveTimelineRank = aboveTask?.timelineRank;
                }
                if(args.below){
                    const belowTask = await prisma.task.findFirst({ where: { id: args.below, projectId: taskRoot?.projectId } })
                    belowTimelineRank = belowTask?.timelineRank;
                }
                let aboveRank = LexoRank.parse(aboveTimelineRank || LexoRank.min().toString())
                let belowRank = LexoRank.parse(belowTimelineRank || LexoRank.max().toString())
                return await prisma.task.update({
                    where: { id: args.id },
                    data: { timelineRank: aboveRank.between(belowRank).toString() }
                })
            },

            updateTask: async (root: any, args: any, context: any) => {
                const rootTask = await prisma.task.findFirst({
                    where: { id: args.id, project: { organisation: context?.jwt?.organisation } }
                })
                if(!rootTask) throw new Error("No task found");

                if (args.input?.status === 'Finished' && rootTask.status !== 'Finished' && rootTask.recurringEventId) {
                    const event = await prisma.recurringEvent.findUnique({ where: { id: rootTask.recurringEventId } });
                    if (event) {
                        const today = new Date(); today.setHours(0,0,0,0);
                        const horizonEnd = new Date(today); horizonEnd.setDate(horizonEnd.getDate() + 365);
                        await ensureGeneratedTasks(prisma, event as any, today, horizonEnd);
                    }
                }

                let projectId;
                if(args.input.projectId) {
                    const p = await prisma.project.findFirst({ where: { displayId: args.input.projectId } })
                    projectId = p?.id
                }

                let nextRank;
                if(args.input?.above || args.input?.below){
                    let aboveColumnRank, belowColumnRank;
                    if(args.input.above){
                        const aboveTask = await prisma.task.findFirst({ where: { id: args.input?.above, projectId: rootTask?.projectId } })
                        aboveColumnRank = aboveTask?.columnRank;
                    }
                    if(args.input.below){
                        const belowTask = await prisma.task.findFirst({ where: { id: args.input?.below, projectId: rootTask?.projectId } })
                        belowColumnRank = belowTask?.columnRank;
                    }
                    let aboveRank = LexoRank.parse(aboveColumnRank || LexoRank.min().toString())
                    let belowRank = LexoRank.parse(belowColumnRank || LexoRank.max().toString())
                    nextRank = aboveRank.between(belowRank).toString();
                }else if(args.input?.status){
                    const { columnRank } = await prisma.task.findFirst({
                        where: { projectId: rootTask?.projectId, status: args.input?.status },
                        orderBy: { columnRank: 'asc' }
                    }) || {}
                    let aboveRank = LexoRank.parse(columnRank || LexoRank.min().toString())
                    let belowRank = LexoRank.parse(LexoRank.max().toString())
                    nextRank = aboveRank.between(belowRank).toString();
                }

                return await prisma.task.update({
                    where: { id: args.id },
                    data: {
                        title: args.input.title,
                        description: args.input.description,
                        members: args.input.members,
                        requiredSkills: args.input.requiredSkills,
                        startDate: args.input.startDate,
                        endDate: args.input.endDate,
                        columnRank: nextRank,
                        status: args.input.status,
                        taskType: args.input.taskType,
                        category: args.input.category,
                        recurringEventId: args.input.recurringEventId,
                        parentId: args.input.parentId || undefined,
                        projectId: projectId,
                        lastUpdated: new Date()
                    }
                })
            },

            updateProjectTaskColumn: async (root: any, args: any, context: any) => {
                return resolvers.Mutation.updateTask(root, { ...args, input: { status: args.status, above: args.above, below: args.below } }, context);
            },

            deleteTask: async (root: any, args: any) => {
                return await prisma.task.delete({where: {id: args.id}})
            },

            // Legacy aliases
            createProjectTask: async (root: any, args: any, context: any) => {
                return resolvers.Mutation.createTask(root, args, context);
            },
            createEstimateTask: async (root: any, args: any, context: any) => {
                return resolvers.Mutation.createTask(root, args, context);
            },
            updateProjectTask: async (root: any, args: any, context: any) => {
                return resolvers.Mutation.updateTask(root, args, context);
            },
            updateEstimateTask: async (root: any, args: any, context: any) => {
                return resolvers.Mutation.updateTask(root, args, context);
            },
            updateProjectTaskTimelineOrder: async (root: any, args: any, context: any) => {
                return resolvers.Mutation.updateTaskTimelineOrder(root, args, context);
            },
            updateEstimateTaskTimelineOrder: async (root: any, args: any, context: any) => {
                return resolvers.Mutation.updateTaskTimelineOrder(root, args, context);
            },
            deleteProjectTask: async (root: any, args: any) => {
                return resolvers.Mutation.deleteTask(root, args);
            },
            deleteEstimateTask: async (root: any, args: any) => {
                return resolvers.Mutation.deleteTask(root, args);
            },

            createTaskDependency: async (root: any, args: any, context: any) => {
                return await prisma.project.update({
                    where: { organisation_displayId: { organisation: context?.jwt?.organisation, displayId: args.project } },
                    data: { tasks: { update: [{ where: { id: args.source }, data: { dependencyOf: { connect: { id: args.target } } } }] } }
                })
            },
            createProjectTaskDependency: async (root: any, args: any, context: any) => {
                return resolvers.Mutation.createTaskDependency(root, args, context);
            },
            createEstimateTaskDependency: async (root: any, args: any, context: any) => {
                return resolvers.Mutation.createTaskDependency(root, args, context);
            },

            deleteTaskDependency: async (root: any, args: any, context: any) => {
                return await prisma.project.update({
                    where: { organisation_displayId: { organisation: context?.jwt?.organisation, displayId: args.project } },
                    data: { tasks: { update: [{ where: { id: args.source }, data: { dependencyOf: { disconnect: { id: args.target } } } }] } }
                })
            },
            deleteProjectTaskDependency: async (root: any, args: any, context: any) => {
                return resolvers.Mutation.deleteTaskDependency(root, args, context);
            },
            deleteEstimateTaskDependency: async (root: any, args: any, context: any) => {
                return resolvers.Mutation.deleteTaskDependency(root, args, context);
            },
            createProjectFolder: async (root: any, args: any, context: any) => {
                const appPath = `/Application Data/Flow/${args.project}`
                const dataPath = path.join(appPath, args.path)

				const fileQuery = `
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

				const fileQuery = `
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

                const moveQuery = `
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

                const renameQuery = `
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

                const deleteQuery = `
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

        # ── Unified Task API ───────────────────────────────────
        createTask(input: TaskInput): Task!
        updateTask(id: ID, input: TaskInput): Task!
        deleteTask(id: ID): Task!
        updateTaskTimelineOrder(id: ID, above: String, below: String): Task!
        updateProjectTaskColumn(id: ID, status: String, above: String, below: String): Task
        createTaskDependency(project: ID, source: ID, target: ID): Task!
        deleteTaskDependency(project: ID, source: ID, target: ID): Task!

        # ── Legacy aliases (ProjectTask / EstimateTask) ────────
        createProjectTask(input: ProjectTaskInput): Task!
        updateProjectTask(id: ID, input: ProjectTaskInput): Task!
        updateProjectTaskTimelineOrder(id: ID, above: String, below: String): Task!
        deleteProjectTask(id: ID): Task!
        createProjectTaskDependency(project: ID, source: ID, target: ID): Task!
        deleteProjectTaskDependency(project: ID, source: ID, target: ID): Task!

        createEstimateTask(input: EstimateTaskInput): Task!
        updateEstimateTask(id: ID, input: EstimateTaskInput): Task!
        updateEstimateTaskTimelineOrder(id: ID, above: String, below: String): Task!
        deleteEstimateTask(id: ID): Task!
        createEstimateTaskDependency(project: ID, source: ID, target: ID): Task!
        deleteEstimateTaskDependency(project: ID, source: ID, target: ID): Task!

        # ── Files ──────────────────────────────────────────────
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
        colour: String
        description: String
        startDate: DateTime
        endDate: DateTime
        status: String
        managers: [String]
    }

    input ProjectWhere {
        archived: Boolean
        status: [String]
        start: DateTime
        end: DateTime
        displayId: String
    }

    type Project {
        id: ID!
        displayId: String
        name: String
        description: String
        colour: String
        organisation: HiveOrganisation
        schedule: [ScheduleItem!]!
        plan: [TimelineItem!]!
        tasks: [Task]
        files(path: String): [File]
        startDate: DateTime
        endDate: DateTime
        status: String
        managers: [HiveUser]
    }

    # ── Unified Task type (replaces ProjectTask + EstimateTask) ─

    type Task {
        id: ID!
        title: String
        description: String
        timelineRank: String
        columnRank: String
        startDate: DateTime
        endDate: DateTime
        status: String
        project: Project
        estimate: Estimate
        recurringEvent: RecurringEvent
        recurringEventId: String
        members: [HiveUser]
        requiredSkills: JSON
        taskType: String
        category: String
        createdBy: HiveUser
        handoverNote: String
        lastUpdated: DateTime
        dependencyOf: [Task]
        dependencyOn: [Task]
        parent: Task
        parentId: String
        children: [Task]
    }

    input TaskInput {
        title: String
        description: String
        members: [String]
        requiredSkills: JSON
        startDate: DateTime
        endDate: DateTime
        status: String
        above: String
        below: String
        projectId: String
        estimateId: String
        handoverNote: String
        taskType: String
        category: String
        recurringEventId: String
        parentId: String
    }

    # Legacy input type aliases (for GQty client compatibility)
    input ProjectTaskInput {
        title: String
        description: String
        members: [String]
        requiredSkills: JSON
        startDate: DateTime
        endDate: DateTime
        status: String
        above: String
        below: String
        projectId: String
        estimateId: String
        handoverNote: String
        taskType: String
        category: String
        recurringEventId: String
        parentId: String
    }

    input EstimateTaskInput {
        title: String
        description: String
        members: [String]
        requiredSkills: JSON
        startDate: DateTime
        endDate: DateTime
        status: String
        above: String
        below: String
        projectId: String
        estimateId: String
        handoverNote: String
        taskType: String
        category: String
        recurringEventId: String
        parentId: String
    }
    
`
    return {
        typeDefs,
        resolvers
    }
}