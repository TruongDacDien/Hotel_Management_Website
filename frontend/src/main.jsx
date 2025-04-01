import "./index.css";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CartProvider } from "./hooks/use-cart";
import { AuthProvider } from "./hooks/use-auth";
import Layout from "./components/layout/Layout";
import Header from "./components/layout/Header";
import HomePage from "./pages/Homepage/HomePage";
import RoomsPage from "./pages/Room/RoomPage";
import ServicesPage from "./pages/Service/ServicePage";
import RoomDetailPage from "./pages/Room/RoomDetailPage";
import ServiceDetailPage from "./pages/Service/ServiceDetailPage";
import ServiceBookingPage from "./pages/Service/ServiceBookingPage";

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
        path: "/rooms/:id",
        element: <RoomDetailPage />,
      },
      {
        path: "/services",
        element: <ServicesPage />,
      },
      {
        path: "/services/:id",
        element: <ServiceDetailPage />,
      },
      {
        path: "/services/:id/book",
        element: <ServiceBookingPage />,
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
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
