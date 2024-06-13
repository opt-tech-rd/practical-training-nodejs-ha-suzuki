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
import Users from "./pages/Users";
import Schedules from "./pages/Schedules";
import Create from "./pages/CreateSchedule";
import { getCurrentUser } from "./firebase";
import { apolloClient } from "./apollo-client";
import { AbilityContext, ability, updateAbility } from "./casl";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Top />,
    loader: async () => {
      const user: any = await getCurrentUser();
      if (!user || !user.emailVerified) {
        return redirect("/login");
      }
      await updateAbility();
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
      await updateAbility({ skipQuery: true });
      return null;
    },
  },
  {
    path: "/users",
    element: <Users />,
    loader: async () => {
      const user: any = await getCurrentUser();
      if (!user || !user.emailVerified) {
        return redirect("/login");
      }
      if (!ability.can("read", "User")) {
        alert("権限エラー");
        return redirect("/");
      }
      return null;
    },
  },
  {
    path: "/schedules",
    element: <Schedules />,
    loader: async () => {
      const user: any = await getCurrentUser();
      if (!user || !user.emailVerified) {
        return redirect("/login");
      }
      if (!ability.can("read", "Schedule")) {
        alert("権限エラー");
        return redirect("/");
      }
      return null;
    },
  },
  {
    path: "/schedules/create",
    element: <Create />,
    loader: async () => {
      const user: any = await getCurrentUser();
      if (!user || !user.emailVerified) {
        return redirect("/login");
      }
      if (!ability.can("create", "Schedule")) {
        alert("権限エラー");
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
      <AbilityContext.Provider value={ability}>
        <ApolloProvider client={apolloClient}>
          <RouterProvider router={router} />
        </ApolloProvider>
      </AbilityContext.Provider>
    </StrictMode>
  );
} else {
  throw new Error();
}
