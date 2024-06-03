// src/index.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Top from "./pages/Top";
import Login from "./pages/Login";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Top />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
} else {
  throw new Error();
}