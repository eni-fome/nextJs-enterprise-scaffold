/**
 * ============================================================================
 * API CLIENT (Singleton Axios Instance)
 * ============================================================================
 *
 * Centralized HTTP client with:
 * - Type-safe base URL from environment config
 * - Auth header injection
 * - Global error handling
 *
 * Usage:
 *   import apiClient from "@/lib/api-client";
 *   const response = await apiClient.get("/users");
 */

import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { env } from "@/env";

/**
 * Get API base URL with environment-aware fallback.
 * - In development: Falls back to localhost if not set
 * - In production: Throws error if not configured (fail loudly)
 */
const getBaseURL = (): string => {
  if (env.NEXT_PUBLIC_API_URL) {
    return env.NEXT_PUBLIC_API_URL;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_API_URL is required in production. " +
        "Add it to your environment variables."
    );
  }

  // Dev-only fallback
  return "http://localhost:3000/api";
};

/**
 * Create singleton Axios instance
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * - Injects auth token from localStorage
 * - Add custom headers as needed
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // ========================================
    // AUTH TOKEN INJECTION (Placeholder)
    // Replace with your auth strategy:
    // - localStorage token
    // - Cookie-based auth
    // - OAuth tokens
    // ========================================
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("[API Request Error]", error.message);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * - Global error handling
 * - Token refresh logic (placeholder)
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url;

    // ========================================
    // GLOBAL ERROR HANDLER
    // Customize based on your API error format
    // ========================================

    switch (status) {
      case 401:
        console.error(`[401 Unauthorized] ${url}`);
        // TODO: Implement token refresh or redirect to login
        // Example: await refreshToken(); return apiClient(error.config);
        break;

      case 403:
        console.error(`[403 Forbidden] ${url}`);
        break;

      case 404:
        console.error(`[404 Not Found] ${url}`);
        break;

      case 500:
        console.error(`[500 Server Error] ${url}`);
        break;

      default:
        console.error(`[API Error ${status}] ${url}`, error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
