const BASE_URL = 'http://localhost:8080';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Users
export const api = {
  users: {
    getAll: () => request('/users'),
    getById: (id) => request(`/users/${id}`),
    create: (data) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  },
  income: {
    getAll: () => request('/income'),
    getById: (id) => request(`/income/${id}`),
    create: (data) => request('/income', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/income/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/income/${id}`, { method: 'DELETE' }),
  },
  expenses: {
    getAll: () => request('/expenses'),
    create: (data) => request('/expenses', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/expenses/${id}`, { method: 'DELETE' }),
  },
  categories: {
    getAll: () => request('/categories'),
    create: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
  },
  budgets: {
    getAll: () => request('/budgets'),
    getById: (id) => request(`/budgets/${id}`),
    create: (data) => request('/budgets', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/budgets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/budgets/${id}`, { method: 'DELETE' }),
  },
  goals: {
    getAll: () => request('/goals'),
    getById: (id) => request(`/goals/${id}`),
    create: (data) => request('/goals', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/goals/${id}`, { method: 'DELETE' }),
  },
  notifications: {
    getAll: () => request('/notifications'),
    getByUser: (userId) => request(`/notifications/user/${userId}`),
    create: (data) => request('/notifications', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/notifications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/notifications/${id}`, { method: 'DELETE' }),
  },
};
