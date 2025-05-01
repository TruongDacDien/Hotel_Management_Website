import { createContext, useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  console.log("AuthProvider mounted");
  const { toast } = useToast();
  //const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
  const [user, setUser] = useState(null);

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      console.warn("Mocking login request", credentials);
      return { id: 1, name: "Guest User", email: credentials.email };
    },
    onSuccess: (userData) => {
      setUser(userData);
      queryClient.setQueryData(["/api/user"], userData);
      toast({
        title: "Welcome back!",
        description: `You've successfully signed in.`,
      });
      window.location.href = "/"; // Sửa lỗi: Thay setLocation("/") bằng navigate("/")
    },
    onError: () => {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      console.warn("Mocking register request", userData);
      return { id: 2, name: userData.name, email: userData.email };
    },
    onSuccess: (userData) => {
      setUser(userData);
      queryClient.setQueryData(["/api/user"], userData);
      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      });
      window.location.href = "/"; // Sửa lỗi
    },
    onError: () => {
      toast({
        title: "Registration failed",
        description: "An error occurred while creating your account.",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      console.warn("Mocking logout request");
    },
    onSuccess: () => {
      setUser(null);
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      window.location.href = "/"; // Sửa lỗi
    },
    onError: () => {
      toast({
        title: "Logout failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: false,
        error: null,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  // console.log("AuthContext value:", context);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
