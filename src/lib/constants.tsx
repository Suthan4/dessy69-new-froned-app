import { OrderStatus, PaymentStatus } from "@/types";

/* ==========================================
   API CONFIGURATION
   ========================================== */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:5000/api";
export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "https://localhost:5000";
export const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY || "";

/* ==========================================
   STORAGE KEYS
   ========================================== */

export const CART_STORAGE_KEY = "dessy69-cart";
export const AUTH_STORAGE_KEY = "dessy69-auth-token";
export const THEME_STORAGE_KEY = "dessy69-theme";

/* ==========================================
   CACHE KEYS (React Query)
   ========================================== */

export const CACHE_KEYS = {
  CATEGORIES: "categories",
  CATEGORY: "category",
  MENU_ITEMS: "menu-items",
  MENU_ITEM: "menu-item",
  COUPONS: "coupons",
  COUPON: "coupon",
  ORDERS: "orders",
  ORDER: "order",
  ORDER_STATS: "order-stats",
  USER: "user",
} as const;

/* ==========================================
   SOCKET EVENTS
   ========================================== */

export const SOCKET_EVENTS = {
  // Connection
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",

  // Menu events
  MENU_CREATED: "menu:created",
  MENU_UPDATED: "menu:updated",
  MENU_DELETED: "menu:deleted",

  // Category events
  CATEGORY_CREATED: "category:created",
  CATEGORY_UPDATED: "category:updated",
  CATEGORY_DELETED: "category:deleted",

  // Order events
  ORDER_NEW: "order:new",
  ORDER_CREATED: "order:created",
  ORDER_UPDATED: "order:updated",
  ORDER_STATUS: "order:status",
  ORDER_TRACKING: "order:tracking",

  // Payment events
  PAYMENT_SUCCESS: "payment:success",

  // Admin events
  ADMIN_JOIN: "join:admin",
  ORDER_TRACK: "order:track",
  ORDER_UNTRACK: "order:untrack",
  ADMIN_REQUEST_ORDERS: "admin:request_orders",
  ADMIN_ORDERS_UPDATE: "admin:orders_update",

  // Request events
  ORDER_REQUEST_STATUS: "order:request_status",
  ORDER_STATUS_UPDATE: "order:status_update",
} as const;

/* ==========================================
   ROUTES
   ========================================== */

export const ROUTES = {
  HOME: "/",
  MENU: "/menu",
  CART: "/cart",
  TRACKING: "/tracking",
  SUCCESS: "/success",
  LOGIN: "/login",
  REGISTER: "/register",
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    ORDERS: "/admin/orders",
    MENU: "/admin/menu",
    CATEGORIES: "/admin/categories",
    COUPONS: "/admin/coupons",
  },
} as const;

/* ==========================================
   ORDER STATUS LABELS & COLORS
   ========================================== */

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Pending Payment",
  [OrderStatus.CONFIRMED]: "Confirmed",
  [OrderStatus.PREPARING]: "Preparing",
  [OrderStatus.READY]: "Ready",
  [OrderStatus.OUT_FOR_DELIVERY]: "Out for Delivery",
  [OrderStatus.DELIVERED]: "Delivered",
  [OrderStatus.CANCELLED]: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  [OrderStatus.CONFIRMED]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  [OrderStatus.PREPARING]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  [OrderStatus.READY]:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  [OrderStatus.OUT_FOR_DELIVERY]:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  [OrderStatus.DELIVERED]:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  [OrderStatus.CANCELLED]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export const ORDER_STATUS_ICONS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "⏳",
  [OrderStatus.CONFIRMED]: "✅",
  [OrderStatus.PREPARING]: "👨‍🍳",
  [OrderStatus.READY]: "🎉",
  [OrderStatus.OUT_FOR_DELIVERY]: "🚚",
  [OrderStatus.DELIVERED]: "📦",
  [OrderStatus.CANCELLED]: "❌",
};

/* ==========================================
   PAYMENT STATUS LABELS & COLORS
   ========================================== */

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "Pending",
  [PaymentStatus.SUCCESS]: "Paid",
  [PaymentStatus.FAILED]: "Failed",
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  [PaymentStatus.SUCCESS]:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  [PaymentStatus.FAILED]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

/* ==========================================
   APP CONFIGURATION
   ========================================== */

export const APP_CONFIG = {
  NAME: "Dessy69 Cafe",
  TAGLINE: "Fruit Fuelled! #dessy69",
  DESCRIPTION: "Fruit-Based Ice Creams and Desserts",
  SUPPORT_EMAIL: "support@dessy69.com",
  SUPPORT_PHONE: "+91 98765 43210",
} as const;

/* ==========================================
   QUERY CLIENT CONFIG
   ========================================== */

export const QUERY_CLIENT_CONFIG = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
};

/* ==========================================
   VALIDATION PATTERNS
   ========================================== */

export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/,
  COUPON_CODE: /^[A-Z0-9]{3,20}$/,
} as const;

/* ==========================================
   DATE FORMATS
   ========================================== */

export const DATE_FORMATS = {
  DISPLAY: "dd MMM yyyy, hh:mm a",
  SHORT: "dd MMM yyyy",
  TIME: "hh:mm a",
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;

/* ==========================================
   ANIMATION DURATIONS (ms)
   ========================================== */

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;
