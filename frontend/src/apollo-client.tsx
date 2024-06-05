import {
  ApolloLink,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getCurrentUser } from "./firebase";
import { config } from "./config";

let httpLink: ApolloLink;
if (import.meta.env.PROD === "production") {
  httpLink = createHttpLink({
    uri: config.deploy_backend.uri,
  });
} else {
  httpLink = createHttpLink({ uri: config.local_backend.uri });
}

const authLink = setContext(async (_, prevContext) => {
  const { headers } = prevContext;
  const user: any = await getCurrentUser();
  const idToken = user && user.emailVerified ? await user.getIdToken() : null;
  return idToken
    ? {
        headers: {
          ...headers,
          Authorization: "Bearer " + idToken,
        },
      }
    : { headers };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
