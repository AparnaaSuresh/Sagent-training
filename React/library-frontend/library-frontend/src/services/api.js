const BASE_URL = 'http://localhost:8081';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ── Members ──────────────────────────────────────────────
export const membersApi = {
  getAll: () => request('/members'),
  getById: (id) => request(`/members/${id}`),
  create: (data) => request('/members', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/members/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/members/${id}`, { method: 'DELETE' }),
};

// ── Books ─────────────────────────────────────────────────
export const booksApi = {
  getById: (id) => request(`/books/${id}`),
  create: (data) => request('/books', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/books/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/books/${id}`, { method: 'DELETE' }),
};

// ── Inventory ─────────────────────────────────────────────
export const inventoryApi = {
  getAll: () => request('/inventory'),
  getById: (id) => request(`/inventory/${id}`),
  create: (data) => request('/inventory', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/inventory/${id}`, { method: 'DELETE' }),
};

// ── Borrows ───────────────────────────────────────────────
export const borrowsApi = {
  getAll: () => request('/borrow'),
  getById: (id) => request(`/borrow/${id}`),
  create: (data) => request('/borrow', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/borrow/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/borrow/${id}`, { method: 'DELETE' }),
};

// ── Fines ─────────────────────────────────────────────────
export const finesApi = {
  getAll: () => request('/fines'),
  getById: (id) => request(`/fines/${id}`),
  create: (data) => request('/fines', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/fines/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/fines/${id}`, { method: 'DELETE' }),
};

// ── Notifications ─────────────────────────────────────────
export const notificationsApi = {
  getAll: () => request('/notifications'),
  getById: (id) => request(`/notifications/${id}`),
  create: (data) => request('/notifications', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => request(`/notifications/${id}`, { method: 'DELETE' }),
};
