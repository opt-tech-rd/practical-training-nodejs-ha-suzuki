import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getCurrentUser } from "./firebase";
import { config } from "./config";

const uri = import.meta.env.PROD
  ? config.deploy_backend.uri
  : config.local_backend.uri;
console.log(uri);
const httpLink = createHttpLink({ uri: uri });

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
