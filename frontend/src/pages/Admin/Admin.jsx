import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../hooks/use-auth";
import { useLocation } from "wouter";
import RoomManagement from "../../components/admin/RoomManagement";
import RoomTypeManagement from "../../components/admin/RoomTypeManagement";
import BookingManagement from "../../components/admin/BookingManagement";
import CustomerManagement from "../../components/admin/CustomerManagement";
import ServiceManagement from "../../components/admin/ServiceManagement";
import ServiceTypeManagement from "../../components/admin/ServiceTypeManagement";
import {
  Bed,
  HotelIcon,
  Layers,
  Calendar,
  Users,
  LogOut,
  Utensils,
  Tag,
} from "lucide-react";
import { ScrollArea } from "../../components/ui/scroll-area";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("room-management");

  if (!user || !user.isAdmin) {
    setLocation("/");
    return null;
  }

  useEffect(function () {
    document.body.classList.add("admin-page");
    return function () {
      document.body.classList.remove("admin-page");
    };
  }, []);

  var sidebarItems = [
    {
      id: "room-management",
      label: "Room Management",
      icon: React.createElement(Bed, { className: "h-5 w-5" }),
    },
    {
      id: "room-types",
      label: "Room Types",
      icon: React.createElement(Layers, { className: "h-5 w-5" }),
    },
    {
      id: "booking-management",
      label: "Booking Management",
      icon: React.createElement(Calendar, { className: "h-5 w-5" }),
    },
    {
      id: "customer-management",
      label: "Customer Management",
      icon: React.createElement(Users, { className: "h-5 w-5" }),
    },
    {
      id: "service-management",
      label: "Service Management",
      icon: React.createElement(Utensils, { className: "h-5 w-5" }),
    },
    {
      id: "service-types",
      label: "Service Types",
      icon: React.createElement(Tag, { className: "h-5 w-5" }),
    },
  ];

  function renderContent() {
    if (activeTab === "room-management") {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Room Status Management</CardTitle>
            <CardDescription>
              Visualize and manage room status by floor. Gray = Empty, Yellow =
              Needs Cleaning, Red = Under Maintenance, Blue = Booked, Green =
              Occupied.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RoomManagement />
          </CardContent>
        </Card>
      );
    }
    if (activeTab === "room-types") {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Room Types Management</CardTitle>
            <CardDescription>
              Manage different room types, their amenities, and pricing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RoomTypeManagement />
          </CardContent>
        </Card>
      );
    }
    if (activeTab === "booking-management") {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Booking Management</CardTitle>
            <CardDescription>
              View and manage all current and upcoming bookings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingManagement />
          </CardContent>
        </Card>
      );
    }
    if (activeTab === "customer-management") {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Customer Management</CardTitle>
            <CardDescription>
              Manage customer accounts and information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerManagement />
          </CardContent>
        </Card>
      );
    }
    if (activeTab === "service-management") {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Service Management</CardTitle>
            <CardDescription>
              Manage hotel services, their details, pricing, and availability.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ServiceManagement />
          </CardContent>
        </Card>
      );
    }
    if (activeTab === "service-types") {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Service Types Management</CardTitle>
            <CardDescription>
              Manage different categories of services offered by the hotel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ServiceTypeManagement />
          </CardContent>
        </Card>
      );
    }
    return null;
  }

  function handleLogout() {
    setLocation("/");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="w-64 border-r bg-muted/40">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2">
              <HotelIcon className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Admin Panel</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Elysian Retreat Hotel
            </p>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              <nav className="space-y-1">
                {sidebarItems.map(function (item) {
                  return (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? "secondary" : "ghost"}
                      className="w-full justify-start text-left h-10"
                      onClick={function () {
                        setActiveTab(item.id);
                      }}
                    >
                      <span className="flex items-center">
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                      </span>
                    </Button>
                  );
                })}
              </nav>
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>

              <Button
                variant="ghost"
                className="w-full justify-start text-left h-9"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Return to Website
              </Button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {
              sidebarItems.find(function (item) {
                return item.id === activeTab;
              })?.label
            }
          </h1>
          <p className="text-muted-foreground">
            Manage hotel operations efficiently
          </p>
        </div>

        <div className="space-y-4">{renderContent()}</div>
      </main>
    </div>
  );
}
