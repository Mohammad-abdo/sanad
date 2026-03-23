import apiClient from './client';

// Authentication
export const adminAuth = {
  login: (credentials) => 
    apiClient.post('/admin/auth/login', credentials),
  
  logout: () => 
    apiClient.post('/admin/auth/logout'),
  
  getMe: () => 
    apiClient.get('/admin/auth/me'),
};

// Dashboard
export const dashboard = {
  getStats: () => 
    apiClient.get('/admin/dashboard'),
  
  getAnalytics: (params) => 
    apiClient.get('/admin/dashboard/analytics', { params }),
};

// Users
export const users = {
  getAll: (params) => 
    apiClient.get('/admin/users', { params }),
  
  getById: (id) => 
    apiClient.get(`/admin/users/${id}`),
  
  create: (data) => 
    apiClient.post('/admin/users', data),
  
  update: (id, data) => 
    apiClient.put(`/admin/users/${id}`, data),
  
  approve: (id) => 
    apiClient.put(`/admin/users/${id}/approve`),
  
  reject: (id, reason) => 
    apiClient.put(`/admin/users/${id}/reject`, { reason }),
  
  activate: (id) => 
    apiClient.put(`/admin/users/${id}/activate`),
  
  deactivate: (id, reason) => 
    apiClient.put(`/admin/users/${id}/deactivate`, { reason }),
  
  delete: (id) => 
    apiClient.delete(`/admin/users/${id}`),
};

// Doctors
export const doctors = {
  getAll: (params) => 
    apiClient.get('/admin/doctors', { params }),
  
  getById: (id) => 
    apiClient.get(`/admin/doctors/${id}`),
  
  create: (data) => 
    apiClient.post('/admin/doctors', data),
  
  update: (id, data) => 
    apiClient.put(`/admin/doctors/${id}`, data),
  
  approve: (id, notes) => 
    apiClient.put(`/admin/doctors/${id}/approve`, { notes }),
  
  reject: (id, data) => 
    apiClient.put(`/admin/doctors/${id}/reject`, data),
  
  verify: (id) => 
    apiClient.put(`/admin/doctors/${id}/verify`),
  
  activate: (id) => 
    apiClient.put(`/admin/doctors/${id}/activate`),
  
  deactivate: (id, reason) => 
    apiClient.put(`/admin/doctors/${id}/deactivate`, { reason }),
};

// Posts
export const posts = {
  getAll: (params) => 
    apiClient.get('/admin/posts', { params }),
  
  moderate: (id, data) => 
    apiClient.put(`/admin/posts/${id}/moderate`, data),
  
  delete: (id) => 
    apiClient.delete(`/admin/posts/${id}`),
};

// Bookings
export const bookings = {
  getAll: (params) => 
    apiClient.get('/admin/bookings', { params }),
  
  getById: (id) => 
    apiClient.get(`/admin/bookings/${id}`),
  
  updateStatus: (id, data) => 
    apiClient.put(`/admin/bookings/${id}/status`, data),
  
  cancel: (id, data) => 
    apiClient.put(`/admin/bookings/${id}/cancel`, data),
};

// Payments & Withdrawals
export const payments = {
  getAll: (params) => 
    apiClient.get('/admin/payments', { params }),
  
  updateStatus: (id, data) => 
    apiClient.put(`/admin/payments/${id}/status`, data),
};

export const withdrawals = {
  getAll: (params) => 
    apiClient.get('/admin/withdrawals', { params }),
  
  getById: (id) => 
    apiClient.get(`/admin/withdrawals/${id}`),
  
  approve: (id, notes) => 
    apiClient.put(`/admin/withdrawals/${id}/approve`, { notes }),
  
  reject: (id, data) => 
    apiClient.put(`/admin/withdrawals/${id}/reject`, data),
};

// Wallets (doctor wallet balance + transactions)
export const wallets = {
  getActiveDoctorWallets: (params) =>
    apiClient.get('/admin/wallets/doctors', { params }),
  getDoctorWalletDetails: (doctorId) =>
    apiClient.get(`/admin/wallets/doctors/${doctorId}`),
};

// Support
export const support = {
  getTickets: (params) => 
    apiClient.get('/admin/support/tickets', { params }),
  
  getTicket: (id) => 
    apiClient.get(`/admin/support/tickets/${id}`),
  
  addReply: (id, data) => 
    apiClient.post(`/admin/support/tickets/${id}/replies`, data),
  
  updateStatus: (id, data) => 
    apiClient.put(`/admin/support/tickets/${id}/status`, data),
  
  assignTicket: (id, data) => 
    apiClient.put(`/admin/support/tickets/${id}/assign`, data),
};

// Reports
export const reports = {
  getAll: (params) => 
    apiClient.get('/admin/reports', { params }),
  
  getById: (id) => 
    apiClient.get(`/admin/reports/${id}`),
  
  generate: (data) => 
    apiClient.post('/admin/reports/generate', data),
  
  download: (id) => 
    apiClient.get(`/admin/reports/${id}/download`, { responseType: 'blob' }),
  
  delete: (id) => 
    apiClient.delete(`/admin/reports/${id}`),
};

// Page Content
export const pages = {
  getAll: () => 
    apiClient.get('/admin/pages'),
  
  getByType: (type) => 
    apiClient.get(`/admin/pages/${type}`),
  
  update: (type, data) => 
    apiClient.put(`/admin/pages/${type}`, data),
  
  initialize: () => 
    apiClient.post('/admin/pages/initialize'),
};

// Interests
export const interests = {
  getAll: (params) => 
    apiClient.get('/admin/interests', { params }),
  
  getById: (id) => 
    apiClient.get(`/admin/interests/${id}`),
  
  create: (data) => 
    apiClient.post('/admin/interests', data),
  
  update: (id, data) => 
    apiClient.put(`/admin/interests/${id}`, data),
  
  delete: (id) => 
    apiClient.delete(`/admin/interests/${id}`),
  
  activate: (id) => 
    apiClient.put(`/admin/interests/${id}/activate`),
  
  deactivate: (id) => 
    apiClient.put(`/admin/interests/${id}/deactivate`),
};

// Tags
export const tags = {
  getAll: (params) => 
    apiClient.get('/admin/tags', { params }),
  
  getById: (id) => 
    apiClient.get(`/admin/tags/${id}`),
  
  getPopular: () => 
    apiClient.get('/admin/tags/popular'),
  
  create: (data) => 
    apiClient.post('/admin/tags', data),
  
  update: (id, data) => 
    apiClient.put(`/admin/tags/${id}`, data),
  
  delete: (id) => 
    apiClient.delete(`/admin/tags/${id}`),
  
  merge: (data) => 
    apiClient.post('/admin/tags/merge', data),
};

// Tips
export const tips = {
  getAll: (params) => 
    apiClient.get('/admin/tips', { params }),
  
  getById: (id) => 
    apiClient.get(`/admin/tips/${id}`),
  
  verify: (id) => 
    apiClient.put(`/admin/tips/${id}/verify`),
  
  feature: (id, data) => 
    apiClient.put(`/admin/tips/${id}/feature`, data),
  
  delete: (id) => 
    apiClient.delete(`/admin/tips/${id}`),
  
  getStats: () => 
    apiClient.get('/admin/tips/stats'),
};

// Activity Logs
export const activityLogs = {
  getAll: (params) => 
    apiClient.get('/admin/activity-logs', { params }),
  
  getById: (id) => 
    apiClient.get(`/admin/activity-logs/${id}`),
  
  getStats: (params) => 
    apiClient.get('/admin/activity-logs/stats', { params }),
  
  export: (params) => 
    apiClient.get('/admin/activity-logs/export', { params, responseType: 'blob' }),
};

// Coupons
export const coupons = {
  getAll: (params) => 
    apiClient.get('/admin/coupons', { params }),
  
  getById: (id) => 
    apiClient.get(`/admin/coupons/${id}`),
  
  getUsage: (id) => 
    apiClient.get(`/admin/coupons/${id}/usage`),
  
  create: (data) => 
    apiClient.post('/admin/coupons', data),
  
  update: (id, data) => 
    apiClient.put(`/admin/coupons/${id}`, data),
  
  delete: (id) => 
    apiClient.delete(`/admin/coupons/${id}`),
  
  activate: (id) => 
    apiClient.put(`/admin/coupons/${id}/activate`),
  
  deactivate: (id) => 
    apiClient.put(`/admin/coupons/${id}/deactivate`),
};

// Admins (SUPER_ADMIN only)
export const admins = {
  getAll: (params) => 
    apiClient.get('/admin/admins', { params }),
  
  getById: (id) => 
    apiClient.get(`/admin/admins/${id}`),
  
  create: (data) => 
    apiClient.post('/admin/admins', data),
  
  update: (id, data) => 
    apiClient.put(`/admin/admins/${id}`, data),
  
  changePassword: (id, data) => 
    apiClient.put(`/admin/admins/${id}/password`, data),
  
  activate: (id) => 
    apiClient.put(`/admin/admins/${id}/activate`),
  
  deactivate: (id) => 
    apiClient.put(`/admin/admins/${id}/deactivate`),
  
  delete: (id) => 
    apiClient.delete(`/admin/admins/${id}`),
};

// Settings
export const settings = {
  get: () => 
    apiClient.get('/admin/settings'),
  
  update: (data) => 
    apiClient.put('/admin/settings', data),
};

// Onboarding
export const onboarding = {
  getAll: (params) => 
    apiClient.get('/admin/onboarding', { params }),
  
  getById: (id) => 
    apiClient.get(`/admin/onboarding/${id}`),
  
  create: (data) => 
    apiClient.post('/admin/onboarding', data),
  
  update: (id, data) => 
    apiClient.put(`/admin/onboarding/${id}`, data),
  
  delete: (id) => 
    apiClient.delete(`/admin/onboarding/${id}`),
  
  reorder: (items) => 
    apiClient.post('/admin/onboarding/reorder', { items }),
};

// Notifications
export const notifications = {
  getAll: (params) => 
    apiClient.get('/admin/notifications', { params }),
  
  markAsRead: (id) => 
    apiClient.put(`/admin/notifications/${id}/read`),
  
  markAllAsRead: () => 
    apiClient.put('/admin/notifications/read-all'),
  
  delete: (id) => 
    apiClient.delete(`/admin/notifications/${id}`),
  
  clearAll: () => 
    apiClient.delete('/admin/notifications/clear-all'),
};

// Content Moderation
export const contentModeration = {
  getStats: () => 
    apiClient.get('/admin/content-moderation/stats'),
  
  testModeration: (data) => 
    apiClient.post('/admin/content-moderation/test', data),
  
  getBannedWords: () => 
    apiClient.get('/admin/content-moderation/banned-words'),
  
  addBannedWord: (data) => 
    apiClient.post('/admin/content-moderation/banned-words', data),
  
  removeBannedWord: (data) => 
    apiClient.delete('/admin/content-moderation/banned-words', { data }),
};
