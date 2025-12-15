import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsApi = {
  getAll: (params?: any) => apiClient.get('/products', { params }),
  getOne: (id: string) => apiClient.get(`/products/${id}`),
  create: (data: any) => apiClient.post('/products', data),
  update: (id: string, data: any) => apiClient.put(`/products/${id}`, data),
  delete: (id: string) => apiClient.delete(`/products/${id}`),
  bulkUpdate: (data: any) => apiClient.post('/products/bulk-update', data),
};

// Categories API
export const categoriesApi = {
  getAll: () => apiClient.get('/categories'),
  getOne: (id: string) => apiClient.get(`/categories/${id}`),
  create: (data: any) => apiClient.post('/categories', data),
  update: (id: string, data: any) => apiClient.put(`/categories/${id}`, data),
  delete: (id: string) => apiClient.delete(`/categories/${id}`),
};

// Orders API
export const ordersApi = {
  getAll: (params?: any) => apiClient.get('/orders', { params }),
  getOne: (id: string) => apiClient.get(`/orders/${id}`),
  create: (data: any) => apiClient.post('/orders', data),
  updateStatus: (id: string, status: string) => 
    apiClient.put(`/orders/${id}/status`, { status }),
};

// Settings API
export const settingsApi = {
  getAll: () => apiClient.get('/settings'),
  getOne: (key: string) => apiClient.get(`/settings/${key}`),
  update: (key: string, value: any) => apiClient.put(`/settings/${key}`, { value }),
};

export default apiClient;
