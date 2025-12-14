"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { IceCream, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="mb-4 inline-block"
          >
            <IceCream size={64} className="text-primary-500" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gradient-primary">
            Dessy69 Cafe
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Admin Panel
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-6 sm:p-8">
          <h2 className="mb-6 text-2xl font-bold">Admin Login</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <Mail
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="email"
                {...register("email")}
                placeholder="admin@dessy69.com"
                className={`input w-full pl-10 ${
                  errors.email ? "border-error" : ""
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter password"
                className={`input w-full px-10 ${
                  errors.password ? "border-error" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-error">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" fullWidth size="lg" loading={isLoggingIn}>
              Sign In
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800">
            <p className="mb-2 text-sm font-medium">Demo Credentials:</p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Email: admin@dessy69.com
              <br />
              Password: admin123
            </p>
          </div>
        </Card>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-neutral-600 hover:text-primary-500 dark:text-neutral-400"
          >
            ← Back to Home
          </a>
        </div>
      </motion.div>
    </div>
  );
}
