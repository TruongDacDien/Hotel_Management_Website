import { useState } from "react";
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
import { HOTEL_INFO } from "../../lib/constants";
import { useForm } from "react-hook-form";

const fakeMutation = {
  mutate: (data) => console.log("Mock submit:", data),
  isPending: false,
};

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4 bg-[#fcfcfc]">
      <div className="container max-w-7xl grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col justify-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Welcome to {HOTEL_INFO.name}
          </h1>
          <p className="text-xl text-muted-foreground max-w-[600px]">
            Join us to experience luxury accommodation, world-class amenities,
            and personalized service. Sign in to your account or register to get
            started.
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
              forgotPasswordMutation={fakeMutation}
            />
          ) : (
            <Tabs
              defaultValue={activeTab}
              onValueChange={setActiveTab}
              className="w-full bg-[#ffffff]"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-[#f5f5f4]">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm
                  loginMutation={fakeMutation}
                  onForgotPassword={() => setShowForgotPassword(true)}
                />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm registerMutation={fakeMutation} />
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
  const onSubmit = (data) => loginMutation.mutate(data);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-[#262d3e] text-white">
              Sign In
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="link"
              onClick={onForgotPassword}
              className="text-sm text-muted-foreground hover:underline"
            >
              Forgot your password?
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

function RegisterForm({ registerMutation }) {
  const form = useForm();
  const onSubmit = (data) => registerMutation.mutate(data);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>
              Register to book rooms, services, and manage your reservations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
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
                  <FormLabel>Phone (optional)</FormLabel>
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
                  <FormLabel>Password</FormLabel>
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-[#262d3e] text-white">
              Create Account
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

function ForgotPasswordForm({ onBack, forgotPasswordMutation }) {
  const form = useForm();
  const onSubmit = (data) => forgotPasswordMutation.mutate(data);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="link"
              onClick={onBack}
              className="text-sm text-muted-foreground"
            >
              Back to sign in
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
