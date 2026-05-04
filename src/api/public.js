import axios from 'axios';
import { normalizeApiBaseUrl } from './baseUrl.js';

// Public API client (no authentication required)
const API_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL || 'http://localhost:3000/api');

const publicApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public Pages API
export const publicPages = {
  getAll: () => 
    publicApiClient.get('/public/pages'),
  
  getByType: (pageType) => 
    publicApiClient.get(`/public/pages/${pageType}`),
};

/** Admin login page: branding + dashboardTheme from database (no auth) */
export const publicBranding = {
  getAdminDashboard: () => publicApiClient.get('/public/admin-dashboard'),
};

