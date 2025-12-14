"use client";

import { ReactNode, useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "react-hot-toast";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { initSocket } from "@/lib/socket";

interface ProvidersProps {
  children: ReactNode;
}

function ThemeInitializer() {
  const { setTheme } = useUIStore();

  useEffect(() => {
    // Initialize theme from localStorage
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("dessy69-theme") as
        | "light"
        | "dark"
        | null;
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const theme = savedTheme || (prefersDark ? "dark" : "light");

      setTheme(theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [setTheme]);

  return null;
}

function SocketInitializer() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  useEffect(() => {
    // Initialize socket connection
    if (typeof window !== "undefined") {
      const socket = initSocket();

      // Cleanup on unmount
      return () => {
        // Don't disconnect socket on unmount to maintain connection
        // Only disconnect when user logs out or closes browser
      };
    }
  }, [isAuthenticated]);

  return null;
}

function ServiceWorkerInitializer() {
  useEffect(() => {
    // Register service worker for PWA
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("✅ Service Worker registered:", registration.scope);
        })
        .catch((error) => {
          console.error("❌ Service Worker registration failed:", error);
        });
    }
  }, []);

  return null;
}

function NotificationPermissionHandler() {
  useEffect(() => {
    // Request notification permission for order updates
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        // Don't request immediately, wait for user interaction
        // Can be requested later in admin dashboard
      }
    }
  }, []);

  return null;
}

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {/* Initialize theme */}
      <ThemeInitializer />

      {/* Initialize socket connection */}
      <SocketInitializer />

      {/* Register service worker */}
      <ServiceWorkerInitializer />

      {/* Handle notifications */}
      <NotificationPermissionHandler />

      {/* App content */}
      {children}

      {/* Toast notifications */}
      {/* <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
            borderRadius: "12px",
            padding: "16px",
            fontSize: "14px",
            maxWidth: "500px",
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            duration: 2000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
          loading: {
            iconTheme: {
              primary: "#f97316",
              secondary: "#fff",
            },
          },
        }}
      /> */}

      {/* React Query Devtools (only in development) */}
      {/* {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom-right"
          buttonPosition="bottom-right"
        />
      )} */}
    </QueryClientProvider>
  );
}
