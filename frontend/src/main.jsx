import "./index.css";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import { Toaster } from "./components/ui/toaster";
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
import AuthPage from "./pages/LoginPage/authPage";
import AboutPage from "./pages/OtherPage/AboutPage";
import ContactPage from "./pages/OtherPage/ContactPage";
import CartPage from "./pages/CartPage/CartPage";
import ProfilePage from "./pages/ProfilePage/UserProfilePage";

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
      {
        path: "/auth",
        element: <AuthPage />,
      },
      {
        path: "/aboutus",
        element: <AboutPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/userprofile",
        element: <ProfilePage />,
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
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
