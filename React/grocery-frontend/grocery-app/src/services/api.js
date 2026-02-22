import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Customers ────────────────────────────────────────────────────────────────
export const customerAPI = {
  register: (data) => api.post('/customers', data),
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

// ─── Categories ───────────────────────────────────────────────────────────────
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// ─── Cart ─────────────────────────────────────────────────────────────────────
export const cartAPI = {
  getAll: () => api.get('/cart'),
  addItem: (customerId, productId, quantity) =>
    api.post(`/cart/${customerId}/${productId}/${quantity}`),
  removeItem: (id) => api.delete(`/cart/${id}`),
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orderAPI = {
  getAll: () => api.get('/orders'),
  placeOrder: (customerId, productId, quantity, deliveryAddress) =>
    api.post(
      `/orders/${customerId}/${productId}/${quantity}?deliveryAddress=${encodeURIComponent(deliveryAddress)}`
    ),
  cancelOrder: (id) => api.delete(`/orders/${id}`),
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
};

export default api;
