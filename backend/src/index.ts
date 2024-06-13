import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "node:fs";
import { GraphQLError } from "graphql";
import { parse } from "url";
import GraphQLJSON from "graphql-type-json";

import { config } from "./config.js";
import { auth } from "./firebase.js";
import {
  updateUserRole,
  createUser,
  getUser,
  getUsers,
  // createSchedule,
} from "./db/database.js";
import { guardByRoles } from "./guards.js";

console.log(config);

async function getRawRules(role) {
  return role === "admin"
    ? [
        {
          action: ["read", "update"],
          subject: ["User"],
          fields: null,
          conditions: null,
        },
        {
          action: ["read", "create"],
          subject: ["Schedule"],
          fields: null,
          conditions: null,
        },
      ]
    : role === "member"
    ? [
        {
          action: ["read"],
          subject: ["User"],
          fields: null,
          conditions: null,
        },
        {
          action: ["read", "create"],
          subject: ["Schedule"],
          fields: null,
          conditions: null,
        },
      ]
    : null;
}

const typeDefs = readFileSync("./schema.graphql", {
  encoding: "utf-8",
});

const resolvers = {
  Query: {
    whoAmI: async (parent, args, contextValue, info) => {
      await guardByRoles(["admin", "member"], contextValue);
      return contextValue.user;
    },
    rawRules: async (parent, args, contextValue, info) => {
      await guardByRoles(["admin", "member"], contextValue);
      return contextValue.rawRules;
    },
    users: async (parent, args, contextValue, info) => {
      await guardByRoles(["admin", "member"], contextValue);
      const users = (await getUsers(contextValue.user.role)) || [];
      return users;
    },
  },
  Mutation: {
    updateUserRole: async (parent, args, contextValue) => {
      await guardByRoles(["admin"], contextValue);
      const { uid, role } = args;
      const user = await updateUserRole(uid, role);
      return user;
    },
    // createSchedule: async (parent, args, contextValue) => {
    //   await guardByRoles(["admin", "member"], contextValue);
    //   const { uid, date, time } = args;
    //   const schedule = await createSchedule(uid, date, time);
    //   return schedule;
    // },
  },
  JSON: GraphQLJSON,
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: parseInt(config.server.port) },

  context: async ({ req }) => {
    const token = req.headers.authorization || "";
    const idToken = token.startsWith("Bearer ") ? token.slice(7) : "";

    const requestUser = idToken
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

    // ローカルホストでバックエンドの挙動を確認するときはコメントアウトする
    if (!isHealthCheck && !requestUser) {
      throw new GraphQLError("requestUser is not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    if (requestUser?.uid) {
      await getUser(requestUser.uid).then((user) => {
        if (!user) {
          return createUser(requestUser);
        }
      });
    }

    const user = !isHealthCheck ? await getUser(requestUser.uid) : null;
    const rawRules = !isHealthCheck ? await getRawRules(user.role) : null;

    return { user, rawRules };
  },
});

console.log(`🚀  Server ready at: ${url}`);
