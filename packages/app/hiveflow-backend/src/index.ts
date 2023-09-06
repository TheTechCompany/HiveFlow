import { config } from "dotenv";
config();
import { HiveGraph } from '@hexhive/graphql-server'
import express from "express";
import schema from "./schema";
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient();

(async () => {

  console.log("RabbitMQ");

  const { typeDefs, resolvers } = schema(prisma);
  
  const graphServer = new HiveGraph({
		rootServer: process.env.ROOT_SERVER || "http://localhost:7000",
    dev: false,
		schema: {
      typeDefs,
      resolvers,
      // driver
    },
    uploads: true
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
