import { create } from "zustand";

interface UIStore {
  // Cart drawer
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Checkout modal
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
  toggleCheckout: () => void;

  // Mobile menu
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;

  // Search
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;

  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Cart drawer
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  // Checkout modal
  isCheckoutOpen: false,
  openCheckout: () => set({ isCheckoutOpen: true, isCartOpen: false }),
  closeCheckout: () => set({ isCheckoutOpen: false }),
  toggleCheckout: () =>
    set((state) => ({ isCheckoutOpen: !state.isCheckoutOpen })),

  // Mobile menu
  isMobileMenuOpen: false,
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  // Search
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  // Loading
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  // Theme
  theme: "light",
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        localStorage.setItem("theme", newTheme);
      }
      return { theme: newTheme };
    }),
  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    }
  },
}));
