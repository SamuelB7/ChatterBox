/**
 * Axios Client Configuration
 * Centralized HTTP client with interceptors and error handling
 */

import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types/api.types';

/**
 * Base API URL from environment variables
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Create Axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Add authentication token, logging, etc.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    // Add authentication token if available
    // const token = localStorage.getItem('authToken');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  },
);

/**
 * Response Interceptor
 * Handle errors globally, transform responses, etc.
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Log error
    console.error('[API Response Error]', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });

    // Handle specific error status codes
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.error('[Bad Request]', data.message);
          break;
        case 401:
          console.error('[Unauthorized] - Redirecting to login...');
          // Handle authentication errors
          // window.location.href = '/login';
          break;
        case 403:
          console.error('[Forbidden]', data.message);
          break;
        case 404:
          console.error('[Not Found]', data.message);
          break;
        case 500:
          console.error('[Server Error]', data.message);
          break;
        default:
          console.error('[Unknown Error]', data.message);
      }
    } else if (error.request) {
      // Network error (no response received)
      console.error('[Network Error] No response received from server');
    } else {
      // Something else happened
      console.error('[Request Setup Error]', error.message);
    }

    return Promise.reject(error);
  },
);

/**
 * Helper function to extract error message from API error
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    return axiosError.response?.data?.message || axiosError.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}

/**
 * Helper function to check if error is a specific status code
 */
export function isErrorStatus(error: unknown, status: number): boolean {
  if (axios.isAxiosError(error)) {
    return error.response?.status === status;
  }
  return false;
}

export default apiClient;
