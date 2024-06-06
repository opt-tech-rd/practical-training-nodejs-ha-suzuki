import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "node:fs";
import { GraphQLError } from "graphql";
import { parse } from "url";
import GraphQLJSON from "graphql-type-json";

import { config } from "./config.js";
import { auth } from "./firebase.js";

async function getRawRules() {
  return [
    {
      action: ["read", "update"],
      subject: ["User"],
      fields: null,
      conditions: null,
    },
  ];
}

const typeDefs = readFileSync("./schema.graphql", {
  encoding: "utf-8",
});

const resolvers = {
  Query: {
    whoAmI: (parent, args, contextValue, info) => contextValue.user,
    rawRules: (parent, args, contextValue, info) => contextValue.rawRules,
  },
  JSON: GraphQLJSON,
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: config.server.port },

  context: async ({ req }) => {
    const token = req.headers.authorization || "";
    const idToken = token.startsWith("Bearer ") ? token.slice(7) : "";

    const user = idToken
      ? await auth
          .verifyIdToken(idToken)
          .then((decodedToken) => {
            const { uid, email } = decodedToken;
            return { uid, email };
          })
          .catch((err) => {
            console.error(err);
            return null;
          })
      : null;

    const parseReqUrl = parse(req.url, true);
    const isHealthCheck = parseReqUrl.query.query === "{__typename}";

    if (!isHealthCheck && !user) {
      throw new GraphQLError("User is not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    const rawRules = !isHealthCheck ? await getRawRules() : null;
    console.log(user);
    console.log(rawRules);

    return { user, rawRules };
  },
});

console.log(`🚀  Server ready at: ${url}`);
