import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Force port 3005 - ensure it's always used
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
    if (error.response?.status === 401) {
      const url = String(error.config?.url || '');
      // لا نُفرغ الجلسة عند فشل تسجيل الدخول (401) — وإلا يُعاد المستخدم لصفحة الدخول دون رسالة واضحة
      const isLoginRequest =
        url.includes('/admin/auth/login') || url.endsWith('/auth/login');
      if (isLoginRequest) {
        return Promise.reject(error);
      }
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

