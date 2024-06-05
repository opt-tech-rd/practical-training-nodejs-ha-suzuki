import {
  ApolloLink,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getCurrentUser } from "./firebase";
// import { config } from "./config";

let httpLink: ApolloLink;
if (process.env.MODE === "production") {
  httpLink = createHttpLink({
    uri: "https://service-backend-ha-suzuki-76lhepmdeq-an.a.run.app",
  });
} else {
  httpLink = createHttpLink({ uri: "http://localhost:8080/" });
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
