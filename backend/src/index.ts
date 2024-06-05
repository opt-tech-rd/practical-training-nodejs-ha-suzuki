import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "node:fs";
import { GraphQLError } from "graphql";

import { config } from "./config.js";
import auth from "./firebase.js";

const typeDefs = readFileSync("./schema.graphql", {
  encoding: "utf-8",
});

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    whoAmI: (parent, args, contextValue, info) => contextValue.user,
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: config.server.port },

  context: async ({ req, res }) => {
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

    // if (!user) {
    //   throw new GraphQLError("User is not authenticated", {
    //     extensions: {
    //       code: "UNAUTHENTICATED",
    //       http: { status: 401 },
    //     },
    //   });
    // }

    return { user };
  },
});

console.log(`🚀  Server ready at: ${url}`);
