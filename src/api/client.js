import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { normalizeApiBaseUrl } from './baseUrl.js';

const API_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = String(error.config?.url || '');
    const isLoginRequest =
      url.includes('/admin/auth/login') || url.endsWith('/auth/login');

    if (error.response?.status === 401) {
      if (isLoginRequest) {
        return Promise.reject(error);
      }
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Invalid / inactive admin session (production DB mismatch, wrong role in token, etc.)
    if (error.response?.status === 403 && url.includes('/admin/') && !isLoginRequest) {
      const code = error.response?.data?.error?.code;
      if (['ADMIN_NOT_FOUND', 'ACCOUNT_INACTIVE', 'UNAUTHORIZED'].includes(code)) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

