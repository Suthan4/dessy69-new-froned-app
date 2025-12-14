import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import { AUTH_STORAGE_KEY } from "@/lib/constants";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAdmin: false,

      setAuth: (user, token) => {
        set({
          user,
          token,
          isAdmin: user.role === "admin",
        });
        if (typeof window !== "undefined") {
          localStorage.setItem(AUTH_STORAGE_KEY, token);
        }
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAdmin: false,
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      },

      isAuthenticated: () => {
        return !!get().token;
      },
    }),
    {
      name: "dessy69-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAdmin: state.isAdmin,
      }),
    }
  )
);
