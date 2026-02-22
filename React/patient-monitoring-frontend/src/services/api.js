import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Patients ────────────────────────────────────────────
export const patientAPI = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
};

// ─── Doctors ─────────────────────────────────────────────
export const doctorAPI = {
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
  create: (data) => api.post('/doctors', data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  delete: (id) => api.delete(`/doctors/${id}`),
};

// ─── Health Data ─────────────────────────────────────────
export const healthDataAPI = {
  getAll: () => api.get('/healthdata'),
  getByPatient: (patientId) => api.get(`/healthdata/patient/${patientId}`),
  getById: (id) => api.get(`/healthdata/${id}`),
  create: (patientId, data) => api.post(`/healthdata/patient/${patientId}`, data),
  update: (id, data) => api.put(`/healthdata/${id}`, data),
  delete: (id) => api.delete(`/healthdata/${id}`),
};

// ─── Medical History ─────────────────────────────────────
export const medicalHistoryAPI = {
  getAll: () => api.get('/medicalhistory'),
  getByPatient: (patientId) => api.get(`/medicalhistory/patient/${patientId}`),
  create: (patientId, data) => api.post(`/medicalhistory/patient/${patientId}`, data),
  update: (id, data) => api.put(`/medicalhistory/${id}`, data),
  delete: (id) => api.delete(`/medicalhistory/${id}`),
};

// ─── Feedback ─────────────────────────────────────────────
export const feedbackAPI = {
  getAll: () => api.get('/feedback'),
  getById: (id) => api.get(`/feedback/${id}`),
  create: (patientId, doctorId, data) => api.post(`/feedback/patient/${patientId}/doctor/${doctorId}`, data),
  update: (id, data) => api.put(`/feedback/${id}`, data),
  delete: (id) => api.delete(`/feedback/${id}`),
};

// ─── Reports ──────────────────────────────────────────────
export const reportAPI = {
  getAll: () => api.get('/reports'),
  getById: (id) => api.get(`/reports/${id}`),
  create: (patientId, healthId, data) => api.post(`/reports/patient/${patientId}/health/${healthId}`, data),
  update: (id, data) => api.put(`/reports/${id}`, data),
  delete: (id) => api.delete(`/reports/${id}`),
};

export default api;
