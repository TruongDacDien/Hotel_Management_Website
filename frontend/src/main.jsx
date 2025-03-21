import "./index.css";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/homepage";

const router = createBrowserRouter([
  {
    path: "/",
    // element: <RootLayout />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
  // {
  //   path: "*",
  //   element: <ErrorPage />,
  // },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <AuthProvider> */}
    <RouterProvider router={router}>
      {/* Đặt UpdateDocumentTitle bên trong RouterProvider */}
      {/* <UpdateDocumentTitle /> */}
    </RouterProvider>
    {/* </AuthProvider> */}
  </React.StrictMode>
);
