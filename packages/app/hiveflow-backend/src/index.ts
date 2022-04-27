import { config } from "dotenv";
config();
import { HiveGraph } from '@hexhive/graphql-server'
import { readFileSync } from 'fs'
import express from "express";
import neo4j from "neo4j-driver";
import { Neo4jGraphQL } from "@neo4j/graphql";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client'

import { Pool } from 'pg';

const prisma = new PrismaClient();

(async () => {


  const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'test',
    database: 'hiveflowtest'
  })


  // const driver = neo4j.driver(
  //   process.env.NEO4J_URI || "localhost",
  //   neo4j.auth.basic(
  //     process.env.NEO4J_USER || "neo4j",
  //     process.env.NEO4J_PASSWORD || "test"
  //   )
  // );

  console.log("RabbitMQ");

  // const resolved = await resolvers(pool, prisma);

  const { typeDefs, resolvers } = schema(prisma);
  // const neoSchema: Neo4jGraphQL = new Neo4jGraphQL({
  //   typeDefs,
  //   resolvers: resolved,
  //   driver,
  // });

  const graphServer = new HiveGraph({
		rootServer: process.env.ROOT_SERVER || "http://localhost:7000",
    dev: false,
		schema: {
      typeDefs,
      resolvers,
      // driver
    }
	})

	await graphServer.init()

  const app = express();

  app.use(graphServer.middleware)
  
//   app.use("/graphql", (req, res, next) => {
//     const hiveJwt = req.headers["x-hive-jwt"]?.toString();

//     console.log(req.headers);
//     if (hiveJwt) {
//       const verified = jwt.verify(
//         hiveJwt,
//         publicKey,
//         { algorithms: ["RS256"] }
//       );

// 	  console.log(verified);

//       (req as any).jwt = {
// 		  ...(verified as any || {}),
//         id: verified?.sub,
//       };
//       next();
//     } else {
//       res.send({ error: "No JWT" });
//     }
//   });

//   app.use(
//     "/graphql",
//     graphqlHTTP({
//       schema: neoSchema.schema,
//       graphiql: true,
//     })
//   );

  app.listen("9011", () => {
    console.log("Listening 9011")
  })
})().catch((err) => {
  console.log("Error", err);
}).finally(async () => {
  await prisma.$disconnect();
});
