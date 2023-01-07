import path from 'path';
import { gql, request } from 'graphql-request'
import { Pool } from "pg";
import {nanoid} from 'nanoid'
import { PrismaClient } from "@prisma/client";

const getProjectPath = (projectId: string, pathSlug?: string) => {
	return path.join(`/AppData/HiveFlow/Projects/${projectId}`, pathSlug || '/');
}

export default async (pool: Pool, prisma: PrismaClient) => {
	return {
		HiveOrganisation: {
			projects: async (root: any) => {
				const res = await pool.query(
					`SELECT * FROM projects WHERE organisation = $1`,
					[root.id]
				)

				return res.rows;
			}
		},
		Project: {
			files: async (project: any, args: {path: string}, context: any) => {
				// fetch files from file microservice
				// context contains gateway internal url

				// console.log({context: context.gatewayUrl})

				// const dataPath = getProjectPath(project.id, args.path)
				

				// const fileQuery = gql`
				// 	{
				// 		files(path: "${dataPath}") {
				// 			id
				// 			name
				// 		}
				// 	}
				// `

				// const data = await request(context.gatewayUrl, fileQuery, {}, {
				// 	'Authorization': `Bearer ${context.token}`
				// })
				
				// console.log({dataPath, data});

				return [{id: '1234', name: "Stuff"}] //data.files.map((x: any) => ({id: x.id}));

			}
		},
		Mutation: {
			createProject: async (root: any, args: {input: any}, context: any) => {

			
				// const res = await pool.query(`
				// 	INSERT INTO projects (id, name, organisation) VALUES ($1, $2, '1234')
				// 	RETURNING *
				// `, [ nanoid(), args.input.name ])

				// console.log({res})
			},
			uploadProjectFiles: async (root: any, args: {project: string, path: string}, context: any) => {
				const dataPath = getProjectPath(args.project, args.path) 

				const fileMutation = gql`
					mutation ($dataPath: String!, $file: String) {
						put(path: $dataPath, file: $file){
							name
						}
					}
				`

				const data = await request(context.gatewayUrl, fileMutation, {
					dataPath,
					file: 'test'	
				}, {
					'X-Hive-JWT': `${context.token}`
				})

				return data;
			},
			deleteProjectFile: async (root: any, args: {project: string, path: string}, context: any) => { 
				const dataPath = getProjectPath(args.project, args.path) 

				const fileMutation = gql`
					mutation ($dataPath: String!) {
						delete(path: $dataPath)
					}
				`

				const data = await request(context.gatewayUrl, fileMutation, {
					dataPath
				}, {
					'X-Hive-JWT': `${context.token}`
				})
			}
		},
		Query : {
		
			projects: async (root: any, args: {ids?: string, where?: {start: Date, end: Date}}, context: any) => {

				let where : any = {};
				if(args.where?.start){
					where.startDate = { lt: args.where.start };
				}
				if(args.where?.end){
					where.endDate = { gt: args.where.end };
				}

				if(args.ids){
					where['id'] = {in: args.ids}
				}

				const result = await prisma.project.findMany({
					where: {
						organisation: context.jwt.organisation,
						...where
					}
				})

				return result.map((x) => ({
					...x,
					organisation: {id: x.organisation}
				}));
			},
			flowWorkInProgress: async (root: any, args: {startDate: Date, endDate: Date}, context: any) => {
				// return await session.readTransaction(async (tx) => {
				// 	let q = args.startDate ? 'WHERE p.startDate > datetime($startDate)' : ''
				// 	if(args.startDate && args.endDate) q += ` AND p.endDate < datetime($endDate)`
				// 	const r = await tx.run(`
				// 		MATCH (p:Project {status: "Job Open"})
				// 		${q}
				// 		MATCH (r:ProjectResult {id: p.id})
				// 		RETURN {
				// 			invoiced: sum(r.invoiced), 
				// 			quoted: sum(r.quoted)
				// 		}
				// 	`, {
				// 		startDate: args.startDate,
				// 		endDate: args.endDate
				// 	})
				// 	return r.records?.[0]?.get(0)
				// })
			},

			
		}
	}
} 