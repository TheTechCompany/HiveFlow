import { Session } from "neo4j-driver"

export default async (session: Session) => {
	return {
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