import { Session } from "neo4j-driver"
import path from 'path';
import { gql, request } from 'graphql-request'

const getProjectPath = (projectId: string, pathSlug?: string) => {
	return path.join(`/AppData/HiveFlow/Projects/${projectId}`, pathSlug || '/');
}

export default async (session: Session) => {
	return {
		Project: {
			files: async (project: any, args: {path: string}, context: any) => {
				// fetch files from file microservice
				// context contains gateway internal url

				console.log({context: context.gatewayUrl})

				const dataPath = getProjectPath(project.id, args.path)
				

				const fileQuery = gql`
					{
						ls(path: "${dataPath}") {
							id
							name
						}
					}
				`

				const data = await request(context.gatewayUrl, fileQuery, {}, {
					'Authorization': `Bearer ${context.token}`
				})
				
				console.log({dataPath, data});

				return [];

			}
		},
		Mutation: {
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

			flowWorkInProgress: async (root: any, args: {startDate: Date, endDate: Date}, context: any) => {
				return await session.readTransaction(async (tx) => {
					let q = args.startDate ? 'WHERE p.startDate > datetime($startDate)' : ''
					if(args.startDate && args.endDate) q += ` AND p.endDate < datetime($endDate)`
					const r = await tx.run(`
						MATCH (p:Project {status: "Job Open"})
						${q}
						MATCH (r:ProjectResult {id: p.id})
						RETURN {
							invoiced: sum(r.invoiced), 
							quoted: sum(r.quoted)
						}
					`, {
						startDate: args.startDate,
						endDate: args.endDate
					})
					return r.records?.[0]?.get(0)
				})
			},

			
		}
	}
} 