"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Menu,
  FolderOpen,
  Tag,
  LogOut,
  Moon,
  Sun,
  X,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/admin/menu", icon: Menu, label: "Menu" },
  { href: "/admin/categories", icon: FolderOpen, label: "Categories" },
  { href: "/admin/coupons", icon: Tag, label: "Coupons" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  // Mock data - replace with actual hooks
  const user = { name: "Administrator", email: "admin@example.com" };
  const isAdmin = true;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const logout = () => {
    console.log("Logging out...");
  };

  useEffect(() => {
    if (!isAdmin) {
      // router.push("/");
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    // return <LoadingScreen />;
  }

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 dark:border-neutral-800 dark:bg-neutral-900 lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-bold text-gradient-primary">
          Dessy69 Cafe
        </h1>
        <div className="w-10" />
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-full w-64 border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 lg:hidden"
            >
              <div className="flex h-full flex-col">
                {/* Mobile Header */}
                <div className="flex items-center justify-between border-b border-neutral-200 p-6 dark:border-neutral-800">
                  <div>
                    <h1 className="text-2xl font-bold text-gradient-primary">
                      Dessy69 Cafe
                    </h1>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Admin Panel
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                      <item.icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </nav>

                {/* Footer */}
                <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
                  <div className="mb-3 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800">
                    <p className="text-sm font-medium">
                      {user?.name || user?.email}
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      Administrator
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={toggleTheme}
                      className="flex-1 rounded-lg bg-neutral-100 p-2 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                      aria-label="Toggle theme"
                    >
                      {theme === "dark" ? (
                        <Sun size={18} />
                      ) : (
                        <Moon size={18} />
                      )}
                    </button>
                    <button
                      onClick={logout}
                      className="flex-1 rounded-lg bg-error/10 p-2 text-error hover:bg-error/20"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 lg:block">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-neutral-200 p-6 dark:border-neutral-800">
            <h1 className="text-2xl font-bold text-gradient-primary">
              Dessy69 Cafe
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Admin Panel
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
            <div className="mb-3 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800">
              <p className="text-sm font-medium">{user?.name || user?.email}</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Administrator
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleTheme}
                className="flex-1 rounded-lg bg-neutral-100 p-2 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={logout}
                className="flex-1 rounded-lg bg-error/10 p-2 text-error hover:bg-error/20"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-0 flex-1 p-4 pt-20 lg:ml-64 lg:p-8 lg:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 lg:hidden">
        <div className="flex items-center justify-around p-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <item.icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
