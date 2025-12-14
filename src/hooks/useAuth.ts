import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/lib/api/endpoints";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useAuth() {
  const { user, token, isAdmin, setAuth, clearAuth, isAuthenticated } =
    useAuthStore();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.token);
      toast.success("Login successful!");
      if (data.data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/menu");
      }
    },
    onError: () => {
      toast.error("Invalid credentials");
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name?: string;
    }) => authApi.register(email, password, name),
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.token);
      toast.success("Registration successful!");
      router.push("/menu");
    },
  });

  const logout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return {
    user,
    token,
    isAdmin,
    isAuthenticated: isAuthenticated(),
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}
