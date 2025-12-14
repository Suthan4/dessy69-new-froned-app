import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { API_BASE_URL, AUTH_STORAGE_KEY } from "@/lib/constants";
import { ApiResponse } from "@/types";
import toast from "react-hot-toast";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem(AUTH_STORAGE_KEY);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse>) => {
        const message = error.response?.data?.message || "An error occurred";

        // Handle different error status codes
        if (error.response?.status === 401) {
          if (typeof window !== "undefined") {
            localStorage.removeItem(AUTH_STORAGE_KEY);
            window.location.href = "/";
          }
          toast.error("Session expired. Please login again.");
        } else if (error.response?.status === 403) {
          toast.error("You do not have permission to perform this action.");
        } else if (error.response?.status === 404) {
          toast.error("Resource not found.");
        } else if (error.response?.status === 422) {
          // Validation errors
          const errors = error.response.data.errors;
          if (errors && errors.length > 0) {
            errors.forEach((err) => toast.error(err.message));
          } else {
            toast.error(message);
          }
        } else if (error.response && error.response.status >= 500) {
          toast.error("Server error. Please try again later.");
        } else if (!error.config?.skipErrorToast) {
          toast.error(message);
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();

// Extend AxiosRequestConfig to include skipErrorToast
declare module "axios" {
  export interface AxiosRequestConfig {
    skipErrorToast?: boolean;
  }
}

