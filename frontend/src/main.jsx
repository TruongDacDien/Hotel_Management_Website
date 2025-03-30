import "./index.css";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CartProvider } from "./hooks/use-cart";
import { AuthProvider } from "./hooks/use-auth";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/Homepage/HomePage";
import RoomsPage from "./pages/Room/RoomPage";
import ServicesPage from "./pages/Service/ServicePage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/rooms",
        element: <RoomsPage />,
      },
      {
        path: "/services",
        element: <ServicesPage />,
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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router}>
            {/* Đặt UpdateDocumentTitle bên trong RouterProvider */}
            {/* <UpdateDocumentTitle /> */}
          </RouterProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
