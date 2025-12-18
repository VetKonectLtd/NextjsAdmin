import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export function formatError(error: unknown): string {
  if (error instanceof AxiosError) {
    const response = error.response;

    if (response) {
      const data = response.data as ApiErrorResponse;

      // Prioritize backend message if available
      if (data?.error) {
        return data.error;
      }
      if (data?.message) {
        return data.message;
      }

      // Handle specific status codes
      switch (response.status) {
        case 400:
          return "Bad Request. Please check your input.";
        case 401:
          return "Session expired. Please login again.";
        case 403:
          return "You do not have permission to perform this action.";
        case 404:
          return "Resource not found.";
        case 422:
          return "Validation failed. Please check your input.";
        case 429:
          return "Too many requests. Please try again later.";
        case 500:
          return "Internal Server Error. Please try again later.";
        case 503:
          return "Service unavailable. Please try again later.";
        default:
          return `Error: ${response.statusText || "Unknown error occurred"}`;
      }
    } else if (error.request) {
      // The request was made but no response was received
      return "Network error. Please check your internet connection.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}
