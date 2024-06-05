import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "node:fs";

import { config } from "./config.js";
import { auth } from "./firebase.js";

import { makeExecutableSchema } from "@graphql-tools/schema";

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

const schema = makeExecutableSchema({ typeDefs, resolvers });

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ schema });

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: config.server.port },

  context: async ({ req, res }) => {
    const token = req.headers.authorization || "";
    const idToken = token.startsWith("Bearer ") ? token.slice(7) : "";

    console.log(idToken);

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

    return { user };
  },
});

console.log(`🚀  Server ready at: ${url}`);
