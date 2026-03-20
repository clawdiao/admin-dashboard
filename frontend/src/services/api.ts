import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me')
};

// Users
export const usersApi = {
  list: (params?: any) => api.get('/admin/users', { params }),
  get: (id: string) => api.get(`/admin/users/${id}`),
  update: (id: string, data: any) => api.patch(`/admin/users/${id}`, data)
};

// Subscriptions
export const subscriptionsApi = {
  list: (params?: any) => api.get('/admin/subscriptions', { params }),
  get: (id: string) => api.get(`/admin/subscriptions/${id}`),
  update: (id: string, data: any) => api.patch(`/admin/subscriptions/${id}`, data)
};

// Metrics
export const metricsApi = {
  overview: () => api.get('/admin/metrics/overview'),
  revenue: (params?: any) => api.get('/admin/metrics/revenue', { params }),
  conversion: () => api.get('/admin/metrics/conversion')
};

// Logs
export const logsApi = {
  list: (params?: any) => api.get('/admin/logs', { params })
};

// System
export const systemApi = {
  health: () => api.get('/system/health'),
  config: () => api.get('/system/config')
};

export default api;
