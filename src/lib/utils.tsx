import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/* ==========================================
   CLASS NAME UTILITIES
   ========================================== */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ==========================================
   CURRENCY FORMATTING
   ========================================== */

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]+/g, ""));
}

/* ==========================================
   DATE FORMATTING
   ========================================== */

export function formatDate(date: string | Date, format?: string): string {
  const d = new Date(date);

  if (format === "short") {
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);
  }

  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(date, "short");
}

export function getTimeAgo(date: string | Date): string {
  return formatRelativeTime(date);
}

/* ==========================================
   PHONE NUMBER FORMATTING
   ========================================== */

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }

  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }

  return phone;
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

/* ==========================================
   TEXT UTILITIES
   ========================================== */

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function capitalizeWords(text: string): string {
  return text
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ==========================================
   VALIDATION UTILITIES
   ========================================== */

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string): boolean {
  const re = /^[6-9]\d{9}$/;
  return re.test(normalizePhone(phone));
}

export function validateCouponCode(code: string): boolean {
  const re = /^[A-Z0-9]{3,20}$/;
  return re.test(code);
}

/* ==========================================
   NUMBER UTILITIES
   ========================================== */

export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ==========================================
   ARRAY UTILITIES
   ========================================== */

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const group = String(item[key]);
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/* ==========================================
   DEBOUNCE & THROTTLE
   ========================================== */

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/* ==========================================
   LOCAL STORAGE UTILITIES
   ========================================== */

export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`);
    return defaultValue;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage: ${error}`);
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage: ${error}`);
  }
}

/* ==========================================
   ORDER ID GENERATION
   ========================================== */

export function generateOrderId(): string {
  const prefix = "DESSY";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

/* ==========================================
   ERROR HANDLING
   ========================================== */

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred";
}

/* ==========================================
   SLEEP UTILITY
   ========================================== */

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ==========================================
   COPY TO CLIPBOARD
   ========================================== */

export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy:", error);
    return false;
  }
}

/* ==========================================
   DOWNLOAD UTILITIES
   ========================================== */

export function downloadFile(
  data: string,
  filename: string,
  type: string = "text/plain"
): void {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
