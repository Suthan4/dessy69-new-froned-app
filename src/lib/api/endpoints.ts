import {
  ApiResponse,
  Category,
  MenuItem,
  Coupon,
  Order,
  OrderStats,
  AuthResponse,
  CustomerDetails,
  OrderItem,
  OrderStatus,
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateMenuItemInput,
  UpdateMenuItemInput,
  CreateCouponInput,
  UpdateCouponInput,
  CreateOrderInput,
  UpdateOrderStatusInput,
  VerifyPaymentInput,
  CreatePaymentOrderResponse,
} from "@/types";
import { apiClient } from "./client";

/* ==========================================
   AUTHENTICATION ENDPOINTS
   ========================================== */

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>("/auth/login", { email, password }),

  register: (email: string, password: string, name?: string) =>
    apiClient.post<AuthResponse>("/auth/register", { email, password, name }),

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("dessy69-auth-token");
    }
  },
};

/* ==========================================
   CATEGORY ENDPOINTS
   ========================================== */

export const categoryApi = {
  getAll: (includeInactive = false) =>
    apiClient.get<ApiResponse<Category[]>>(
      `/categories?includeInactive=${includeInactive}`
    ),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Category>>(`/categories/${id}`),

  create: (data: CreateCategoryInput) =>
    apiClient.post<ApiResponse<Category>>("/categories", data),

  update: (id: string, data: UpdateCategoryInput) =>
    apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse>(`/categories/${id}`),
};

/* ==========================================
   MENU ENDPOINTS
   ========================================== */

export const menuApi = {
  getAll: (params?: { categoryId?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.categoryId) queryParams.append("categoryId", params.categoryId);
    if (params?.search) queryParams.append("search", params.search);

    return apiClient.get<ApiResponse<MenuItem[]>>(
      `/products${queryParams.toString() ? `?${queryParams}` : ""}`
    );
  },

  getById: (id: string) =>
    apiClient.get<ApiResponse<MenuItem>>(`/products/${id}`),

  create: (data: CreateMenuItemInput) =>
    apiClient.post<ApiResponse<MenuItem>>("/products", data),

  update: (id: string, data: UpdateMenuItemInput) =>
    apiClient.put<ApiResponse<MenuItem>>(`/products/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse>(`/products/${id}`),
};

/* ==========================================
   COUPON ENDPOINTS
   ========================================== */

export const couponApi = {
  getAll: (includeInactive = false) =>
    apiClient.get<ApiResponse<Coupon[]>>(
      `/coupons?includeInactive=${includeInactive}`
    ),

  getById: (id: string) => apiClient.get<ApiResponse<Coupon>>(`/coupons/${id}`),

  apply: (code: string, orderAmount: number) =>
    apiClient.post<
      ApiResponse<{
        valid: boolean;
        discount: number;
        message: string;
        coupon?: Coupon;
      }>
    >("/coupons/apply", { code, orderAmount }),

  create: (data: CreateCouponInput) =>
    apiClient.post<ApiResponse<Coupon>>("/coupons", data),

  update: (id: string, data: UpdateCouponInput) =>
    apiClient.put<ApiResponse<Coupon>>(`/coupons/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse>(`/coupons/${id}`),
};

/* ==========================================
   ORDER ENDPOINTS
   ========================================== */

export const orderApi = {
  create: (data: CreateOrderInput) =>
    apiClient.post<ApiResponse<Order>>("/orders", data),

  getById: (orderId: string) =>
    apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`),

  getAll: (params?: {
    status?: OrderStatus;
    startDate?: string;
    endDate?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    return apiClient.get<ApiResponse<Order[]>>(
      `/orders${queryParams.toString() ? `?${queryParams}` : ""}`
    );
  },

  updateStatus: (orderId: string, data: UpdateOrderStatusInput) =>
    apiClient.put<ApiResponse<Order>>(`/orders/${orderId}/status`, data),

  verifyPayment: (data: VerifyPaymentInput) =>
    apiClient.post<ApiResponse<Order>>("/orders/verify-payment", data),

  getStats: () => apiClient.get<ApiResponse<OrderStats>>("/orders/stats"),
};

/* ==========================================
   PAYMENT ENDPOINTS
   ========================================== */

export const paymentApi = {
  createOrder: (orderId: string) =>
    apiClient.post<ApiResponse<CreatePaymentOrderResponse>>(
      "/payment/create-order",
      { orderId }
    ),

  verify: (data: VerifyPaymentInput) =>
    apiClient.post<ApiResponse>("/payment/verify", data),

  getDetails: (paymentId: string) =>
    apiClient.get<ApiResponse>(`/payment/${paymentId}`),
};
