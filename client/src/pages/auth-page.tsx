import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Form schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user, isLoading, loginMutation, registerMutation } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle login submission
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  // Handle register submission
  const onRegisterSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FFFAF7] relative overflow-hidden">
      {/* Circular decorative elements - Login top */}
      <div className="absolute top-0 left-0 w-[150px] h-[150px] bg-[#ED8FB1] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      
      {/* Circular decorative elements - Login right */}
      <div className="absolute top-[100px] right-[100px] w-[80px] h-[80px] bg-[#E9D686] rounded-full hidden md:block"></div>
      <div className="absolute top-[220px] right-[50px] w-[120px] h-[120px] bg-[#E9D686] rounded-full hidden md:block"></div>
      
      {/* Auth forms (centered) */}
      <div className="w-full flex items-center justify-center px-6 py-12 relative z-10">
        <Card className="w-full max-w-md bg-white rounded-3xl shadow-lg overflow-hidden">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-[#CB9C5E]">
              {activeTab === "login" ? "Login" : "Register"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {activeTab === "login" 
                ? "Inicia sesión para acceder a tu cuenta" 
                : "Crea una cuenta para disfrutar de beneficios exclusivos"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#f9f4ee]">
                <TabsTrigger 
                  value="login"
                  className="data-[state=active]:bg-[#FDBC9B] data-[state=active]:text-white"
                >
                  Iniciar Sesión
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className="data-[state=active]:bg-[#FDBC9B] data-[state=active]:text-white"
                >
                  Registrarse
                </TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#CB9C5E]">Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="tu@email.com" 
                              className="bg-[#f9f4ee] border-0 focus-visible:ring-[#CB9C5E]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#CB9C5E]">Contraseña</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••"
                              className="bg-[#f9f4ee] border-0 focus-visible:ring-[#CB9C5E]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full mt-8 bg-[#FDBC9B] hover:bg-[#CB9C5E] text-white rounded-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#CB9C5E]">Nombre</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Tu nombre"
                              className="bg-[#f9f4ee] border-0 focus-visible:ring-[#CB9C5E]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#CB9C5E]">Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="tu@email.com"
                              className="bg-[#f9f4ee] border-0 focus-visible:ring-[#CB9C5E]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#CB9C5E]">Contraseña</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••"
                              className="bg-[#f9f4ee] border-0 focus-visible:ring-[#CB9C5E]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#CB9C5E]">Confirmar Contraseña</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••"
                              className="bg-[#f9f4ee] border-0 focus-visible:ring-[#CB9C5E]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full mt-8 bg-[#FDBC9B] hover:bg-[#CB9C5E] text-white rounded-full" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creando cuenta..." : "Crear Cuenta"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Circular decorative elements - Bottom */}
      <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-[#ED8FB1] rounded-full translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute bottom-[100px] left-[50px] w-[120px] h-[120px] bg-[#EBB477] rounded-full hidden md:block"></div>
    </div>
  );
}