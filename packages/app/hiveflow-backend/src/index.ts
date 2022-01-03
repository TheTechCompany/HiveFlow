import { config } from "dotenv";
config();
import { readFileSync } from 'fs'
import express from "express";
import neo4j from "neo4j-driver";
import { Neo4jGraphQL } from "@neo4j/graphql";
import { graphqlHTTP } from "express-graphql";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import jwt from "jsonwebtoken";


const publicKey = readFileSync("./public.key", 'utf8');

(async (publicKey: string) => {
  const driver = neo4j.driver(
    process.env.NEO4J_URI || "localhost",
    neo4j.auth.basic(
      process.env.NEO4J_USER || "neo4j",
      process.env.NEO4J_PASSWORD || "test"
    )
  );

  console.log("RabbitMQ");

  const resolved = await resolvers(driver.session());

  const neoSchema: Neo4jGraphQL = new Neo4jGraphQL({
    typeDefs,
    resolvers: resolved,
    driver,
  });

  const app = express();

  app.use("/graphql", (req, res, next) => {
    const hiveJwt = req.headers["x-hive-jwt"]?.toString();

    console.log(req.headers);
    if (hiveJwt) {
      const verified = jwt.verify(
        hiveJwt,
        publicKey,
        { algorithms: ["RS256"] }
      );

	  console.log(verified);

      (req as any).jwt = {
		  ...(verified as any || {}),
        id: verified?.sub,
      };
      next();
    } else {
      res.send({ error: "No JWT" });
    }
  });

  app.use(
    "/graphql",
    graphqlHTTP({
      schema: neoSchema.schema,
      graphiql: true,
    })
  );

  app.listen("9011");
})(publicKey);
