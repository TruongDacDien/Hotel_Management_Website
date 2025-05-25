import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import {
  callSignUp,
  callLogin,
  callSignOut,
  sendCode,
  sendResetPass,
  checkCode,
} from "../config/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  console.log("AuthProvider mounted");
  const { toast } = useToast();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const res = await callLogin(credentials);

      if (!res.success) throw new Error(res.message || "Đăng ký thất bại");
      return res.data;
    },
    onSuccess: (userData) => {
      console.log("onSuccess", userData);
      setUser(userData);
      toast({ title: "Đăng nhập thành công" });
    },
    onError: () => {
      toast({
        title: "Thất bại",
        description: "Không thể đăng nhập",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const res = await callSignUp(userData);
      if (!res.success) throw new Error(res.message || "Đăng ký thất bại");
      return res.data;
    },
    onSuccess: (userData) => {
      setUser(userData);
      toast({ title: "Đăng ký thành công" });
      window.location.href = "/auth"; // Sửa lỗi
    },
    onError: () => {
      toast({
        title: "Thất bại",
        description: "Không thể tạo tài khoản",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await callSignOut();
      if (!res.success) throw new Error(res.message || "Đăng xuất thất bại");
      return res.data;
    },
    onSuccess: () => {
      setUser(null);
      localStorage.removeItem("user");
      toast({ title: "Đăng xuất thành công" });
      setTimeout(() => {
        window.location.href = "/";
      }, 500); // Sửa lỗi
    },
    onError: () => {
      toast({
        title: "Logout failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email) => {
      const res = await sendCode(email);
      if (!res.success) throw new Error(res.message || "Gửi yêu cầu thất bại");
      return res.data;
    },
    onSuccess: () => {
      toast({ title: "Yêu cầu đặt lại mật khẩu đã được gửi" });
    },
    onError: () => {
      toast({
        title: "Thất bại",
        description: "Không thể gửi yêu cầu",
        variant: "destructive",
      });
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: async ({ email, verificationCode }) => {
      const res = await checkCode(email, verificationCode);
      return res;
    },
    onError: () => {
      toast({
        title: "Thất bại",
        description: "Không thể gửi yêu cầu",
        variant: "destructive",
      });
    },
  });

  const sendResetPassMutation = useMutation({
    mutationFn: async (email) => {
      const res = await sendResetPass(email);
      return res.data;
    },
    onSuccess: async () => {
      toast({ title: "Mật khẩu mới đã được gửi về email" });
    },
    onError: () => {
      toast({
        title: "Thất bại",
        description: "Không thể gửi yêu cầu",
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
        forgotPasswordMutation,
        verifyCodeMutation,
        sendResetPassMutation,
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
