import { PrismaClient } from '@prisma/client';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { gql } from 'graphql-tag';

import project from './project';
import estimate from './estimate';
import schedule from './schedule';
import equipment from './equipment';
import reports from './reports';
import assignment from './assignment';

import { JSONDefinition, JSONResolver } from 'graphql-scalars';

export default (prisma: PrismaClient) => {
	
	const { typeDefs: assignmentTypeDefs, resolvers: assignmentResolvers } = assignment(prisma);
	const { typeDefs: projectTypeDefs, resolvers: projectResolvers } = project(prisma);
	const { typeDefs: estimateTypeDefs, resolvers: estimateResolvers } = estimate(prisma);
	const { typeDefs: scheduleTypeDefs, resolvers: scheduleResolvers } = schedule(prisma);
	const { typeDefs: equipmentTypeDefs, resolvers: equipmentResolvers } = equipment(prisma);
	const { typeDefs: reportTypeDefs, resolvers: reportResolvers } = reports(prisma);


	const resolvers = {
		HiveOrganisation: {
			projects: async (root: any) => {
				return await prisma.project.findMany({where: {organisation: root.id}});

			}
		},
		Query: {
			organisation: (root: any, args: {ids: string[]}, context: any) => {
				return {id: context.jwt.organisation} 
			},
		}
	};

	const typeDefs = gql`

		type HiveOrganisation {
			id: ID
			schedule: [ScheduleItem!]! 
			timeline: [TimelineItem!]! 

			projects: [Project!]! 
			people: [People!]! 
			equipment: [Equipment!]!
			estimates: [Estimate!]!
		}

		type WorkInProgress {
			quoted: Float
			invoiced: Float
			start: DateTime
			end: DateTime
		}

		type Query {
			organisation: HiveOrganisation @merge(keyField: "id", keyArg: "ids")
			flowWorkInProgress(startDate: DateTime, endDate: DateTime) : WorkInProgress 
		}

		type Mutation {
			empty: String
		}

		type File {
			id: ID!
		}

		type ProjectResult {
			id: ID! 
			quoted: Float
			invoiced: Float
			organisation: HiveOrganisation 
		}


		type People {
			id: ID! 
			name: String

			organisation: HiveOrganisation
			inactive: Boolean
		}

`
	return {
		typeDefs: mergeTypeDefs([
			JSONDefinition,
			assignmentTypeDefs,
			typeDefs, 
			projectTypeDefs,
			estimateTypeDefs,
			equipmentTypeDefs,
			reportTypeDefs,
			scheduleTypeDefs
		]),
		resolvers: mergeResolvers([
			{JSON: JSONResolver},
			assignmentResolvers,
			resolvers, 
			projectResolvers,
			equipmentResolvers,
			estimateResolvers,
			reportResolvers,
			scheduleResolvers
		])
	}
}