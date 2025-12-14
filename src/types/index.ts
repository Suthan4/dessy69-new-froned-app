// src/types/index.ts - Complete Type Definitions

/* ==========================================
   CATEGORY TYPES
   ========================================== */

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

/* ==========================================
   MENU ITEM TYPES
   ========================================== */

export interface Variant {
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  categoryId: Category | string;
  image?: string;
  variants: Variant[];
  isAvailable: boolean;
  popularity: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuItemInput {
  name: string;
  description: string;
  categoryId: string;
  image?: string;
  variants: Variant[];
  isAvailable?: boolean;
  popularity?: number;
  tags?: string[];
}

export interface UpdateMenuItemInput {
  name?: string;
  description?: string;
  categoryId?: string;
  image?: string;
  variants?: Variant[];
  isAvailable?: boolean;
  popularity?: number;
  tags?: string[];
}

/* ==========================================
   COUPON TYPES
   ========================================== */

export type DiscountType = "percentage" | "fixed";

export interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponInput {
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  validFrom: string;
  validUntil: string;
  isActive?: boolean;
}

export interface UpdateCouponInput {
  code?: string;
  description?: string;
  discountType?: DiscountType;
  discountValue?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  validFrom?: string;
  validUntil?: string;
  isActive?: boolean;
}

export interface ApplyCouponResponse {
  valid: boolean;
  discount: number;
  message: string;
  coupon?: Coupon;
}

/* ==========================================
   CART TYPES
   ========================================== */

export interface CartItem {
  menuItem: MenuItem;
  variant: Variant;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (menuItem: MenuItem, variant: Variant, quantity?: number) => void;
  removeItem: (menuItemId: string, variantName: string) => void;
  updateQuantity: (
    menuItemId: string,
    variantName: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getItem: (menuItemId: string, variantName: string) => CartItem | undefined;
}

/* ==========================================
   ORDER TYPES
   ========================================== */

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  READY = "ready",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum PaymentStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  variantName: string;
  price: number;
  quantity: number;
}

export interface TrackingHistory {
  status: OrderStatus;
  timestamp: string;
  notes?: string;
}

export interface Order {
  id: number;
  orderId: string;
  customerDetails: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  couponCode?: string;
  discount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  notes?: string;
  estimatedTime?: number;
  trackingHistory: TrackingHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  customerDetails: CustomerDetails;
  items: OrderItem[];
  couponCode?: string;
  notes?: string;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
  notes?: string;
  estimatedTime?: number;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  todayOrders: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
}

/* ==========================================
   AUTHENTICATION TYPES
   ========================================== */

export type UserRole = "admin" | "customer";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

/* ==========================================
   UI STATE TYPES
   ========================================== */

export type Theme = "light" | "dark";

export interface UIState {
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

  // Loading
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Theme
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

/* ==========================================
   API RESPONSE TYPES
   ========================================== */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ApiError[];
}

export interface ApiError {
  field: string;
  message: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/* ==========================================
   PAYMENT TYPES (RAZORPAY)
   ========================================== */

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface CreatePaymentOrderResponse {
  id: string;
  amount: number;
  currency: string;
  orderId: string;
  keyId: string;
}

export interface VerifyPaymentInput {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

/* ==========================================
   SOCKET.IO EVENT TYPES
   ========================================== */

export interface SocketEventMap {
  // Menu events
  "menu:created": (data: MenuItem) => void;
  "menu:updated": (data: MenuItem) => void;
  "menu:deleted": (data: { id: string }) => void;

  // Category events
  "category:created": (data: Category) => void;
  "category:updated": (data: Category) => void;
  "category:deleted": (data: { id: string }) => void;

  // Order events
  "order:new": (data: Order) => void;
  "order:created": (data: { orderId: string }) => void;
  "order:updated": (data: Order) => void;
  "order:status": (data: {
    status: OrderStatus;
    estimatedTime?: number;
    notes?: string;
    timestamp: string;
  }) => void;
  "order:tracking": (data: { orderId: string; status: OrderStatus }) => void;

  // Payment events
  "payment:success": (data: { orderId: string }) => void;

  // Admin events
  "join:admin": () => void;
  "order:track": (orderId: string) => void;
  "order:untrack": (orderId: string) => void;
}

/* ==========================================
   FORM TYPES
   ========================================== */

export interface CheckoutFormData {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  name?: string;
  confirmPassword: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

export interface MenuItemFormData {
  name: string;
  description: string;
  categoryId: string;
  image?: string;
  variants: Variant[];
  isAvailable: boolean;
  popularity: number;
  tags: string[];
}

export interface CouponFormData {
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

/* ==========================================
   UTILITY TYPES
   ========================================== */

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type PickRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type WithId<T> = T & { id: string };

export type Timestamp = string | Date;

/* ==========================================
   COMPONENT PROP TYPES
   ========================================== */

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
}

/* ==========================================
   QUERY KEYS
   ========================================== */

export const QUERY_KEYS = {
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

export type QueryKey = (typeof QUERY_KEYS)[keyof typeof QUERY_KEYS];

/* ==========================================
   ENVIRONMENT VARIABLES
   ========================================== */

export interface EnvironmentVariables {
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_SOCKET_URL: string;
  NEXT_PUBLIC_RAZORPAY_KEY: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvironmentVariables {}
  }
}

/* ==========================================
   WINDOW EXTENSIONS
   ========================================== */

declare global {
  interface Window {
    Razorpay: any;
  }
}
