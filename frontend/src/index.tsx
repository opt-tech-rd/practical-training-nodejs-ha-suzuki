import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import { ApolloProvider } from "@apollo/client";

import Top from "./pages/Top";
import Login from "./pages/Login";
import { getCurrentUser } from "./firebase";
import { apolloClient } from "./apollo-client";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Top />,
    loader: async () => {
      const user: any = await getCurrentUser();
      if (!user || !user.emailVerified) {
        return redirect("/login");
      }
      return null;
    },
  },
  {
    path: "/login",
    element: <Login />,
    loader: async () => {
      const user: any = await getCurrentUser();
      if (user && user.emailVerified) {
        return redirect("/");
      }
      return null;
    },
  },
]);

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <ApolloProvider client={apolloClient}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </StrictMode>
  );
} else {
  throw new Error();
}
