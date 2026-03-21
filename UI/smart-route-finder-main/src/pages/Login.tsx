import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppStore } from "../store/useAppStore";
import { apiClient } from "../lib/axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const setAuth = useAppStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.post("/auth/login", values);
      
      setAuth(data.data.user, data.data.token);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      // Redirect based on role
      if (data.data.user.role === "SUPERADMIN") {
        navigate("/superadmin");
      } else if (data.data.user.role === "ENTERPRISE") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950 animate-in fade-in zoom-in-95 duration-500">
      <div className="mx-auto w-full max-w-md space-y-6 rounded-2xl bg-white/70 backdrop-blur-xl p-8 shadow-2xl dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-primary/5">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Log In</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Enter your credentials to access your account</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
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
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm">
          <span className="text-zinc-500">Don't have an account? </span>
          <Button variant="link" className="p-0 text-zinc-900 dark:text-zinc-50" onClick={() => navigate('/register')}>
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
