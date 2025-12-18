import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { formatError } from "./error-utils";

// Extend Axios config to include custom properties
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  silent?: boolean; // If true, suppresses global error toast
}

// Define a standard error response structure
interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

// Create an Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10s timeout is good practice
});

// Request interceptor to add the auth token to headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const config = error.config as CustomAxiosRequestConfig;

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // TODO: Implement refresh token logic here if backend supports it.
      // For now, we force logout to prevent infinite loops or invalid state.
      localStorage.removeItem("token");

      // Optional: Dispatch a custom event so the UI can react (e.g., show a toast)
      window.dispatchEvent(new Event("auth:unauthorized"));

      // Redirect to login if not already there
      if (window.location.pathname !== "/login") {
        // window.location.href = '/login';
      }
    }

    // Show global toast unless suppressed
    if (!config?.silent) {
      toast.error(formatError(error));
    }

    return Promise.reject(error);
  }
);

export default apiClient;
