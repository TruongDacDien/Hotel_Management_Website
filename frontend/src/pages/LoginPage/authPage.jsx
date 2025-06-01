import { useState } from "react";
import Cookies from "js-cookie";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { useForm } from "react-hook-form";
import { data, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";

export default function AuthPage() {
  const {
    loginMutation,
    registerMutation,
    forgotPasswordMutation,
    verifyCodeMutation,
    sendResetPassMutation,
  } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4 bg-[#fcfcfc]">
      <div className="container max-w-7xl grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col justify-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Chào mừng bạn!
          </h1>
          <p className="text-xl text-muted-foreground max-w-[600px]">
            Hãy tham gia cùng chúng tôi để trải nghiệm chỗ ở sang trọng, tiện
            nghi đẳng cấp thế giới và dịch vụ được cá nhân hóa. Đăng nhập vào
            tài khoản của bạn hoặc đăng ký để bắt đầu.
          </p>
          <div className="h-64 bg-cover bg-center rounded-lg overflow-hidden mt-6 shadow-lg hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              alt="Hotel Lobby"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center ">
          {showForgotPassword ? (
            <ForgotPasswordForm
              onBack={() => setShowForgotPassword(false)}
              forgotPasswordMutation={forgotPasswordMutation}
              verifyCodeMutation={verifyCodeMutation}
              sendResetPassMutation={sendResetPassMutation}
            />
          ) : (
            <Tabs
              defaultValue={activeTab}
              onValueChange={setActiveTab}
              className="w-full bg-[#ffffff]"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-[#f5f5f4]">
                <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                <TabsTrigger value="register">Đăng ký</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm
                  loginMutation={loginMutation}
                  onForgotPassword={() => setShowForgotPassword(true)}
                />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm registerMutation={registerMutation} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}

function LoginForm({ loginMutation, onForgotPassword }) {
  const form = useForm();
  const navigate = useNavigate();
  const onSubmit = (data) => {
    loginMutation.mutate(data, {
      onSuccess: (userData) => {
        const { accesssToken, refreshToken } = userData.tokens;

        // Lưu token vào cookie
        Cookies.set("access_token", accesssToken, { expires: 1 }); // expires: 1 = 1 ngày
        Cookies.set("refresh_token", refreshToken, { expires: 7 });
        localStorage.setItem("user", JSON.stringify(userData));

        navigate("/"); // ✅ điều hướng về trang chủ
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Đăng nhập</CardTitle>
            <CardDescription>
              Nhập thông tin đăng nhập của bạn để truy cập tài khoản của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên tài khoản</FormLabel>
                  <FormControl>
                    <Input placeholder="irisus123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-[#262d3e] text-white">
              Đăng nhập
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="link"
              onClick={onForgotPassword}
              className="text-sm text-muted-foreground hover:underline"
            >
              Quên mật khẩu?
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

function RegisterForm({ registerMutation }) {
  const form = useForm({
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      phone: "",
      password: "",
    },
  });
  const onSubmit = (data) => {
    console.log("Form data trước khi gửi:", data);
    registerMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Tạo tài khoản</CardTitle>
            <CardDescription>
              Đăng ký để đặt phòng, dịch vụ và quản lý đặt phòng của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên tài khoản</FormLabel>
                  <FormControl>
                    <Input placeholder="irisus" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Só điện thoại (bắt buộc)</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              rules={{
                validate: (value) =>
                  value === form.getValues("password") ||
                  "Mật khẩu xác nhận không khớp",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-[#262d3e] text-white">
              Đăng ký
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

function ForgotPasswordForm({
  onBack,
  forgotPasswordMutation,
  verifyCodeMutation,
  sendResetPassMutation,
}) {
  const [step, setStep] = useState("email"); // email | verify | done
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm();
  const onSubmit = async (data) => {
    console.log(data.email);

    if (step === "email") {
      setIsLoading(true);
      setEmail(data.email);
      await forgotPasswordMutation.mutateAsync(data.email); // Gửi mã
      setStep("verify");
      setIsLoading(false);
    } else if (step === "verify") {
      setIsLoading(true);
      const res = await verifyCodeMutation.mutateAsync({
        email,
        verificationCode: data.code,
      });
      console.log(res);

      if (res.success) {
        //toast({ title: "Mã đúng" });
        await sendResetPassMutation.mutateAsync(email);
        setIsLoading(false);
        setStep("done");
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Đặt lại mật khẩu</CardTitle>
            <CardDescription>
              {step === "email"
                ? "Nhập email để gửi mã xác nhận"
                : step === "verify"
                ? "Nhập mã xác nhận bạn nhận được"
                : "Mật khẩu mới đã được gửi qua email"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {step === "email" && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {step === "verify" && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã xác nhận</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập mã xác nhận" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {step === "done" && (
              <p className="text-center text-sm text-muted-foreground">
                Mật khẩu mới đã được gửi đến email của bạn.
              </p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            {step === "email" && (
              <Button variant="custom" type="submit" className="w-full">
                {isLoading ? "Đang gửi..." : "Gửi mã xác nhận"}
              </Button>
            )}

            {step === "verify" && (
              <Button variant="custom" type="submit" className="w-full">
                {isLoading ? "Đang xác nhận..." : "Xác nhận"}
              </Button>
            )}

            <Button
              variant="link"
              onClick={onBack}
              className="text-sm text-muted-foreground"
            >
              Trở lại đăng nhập
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
