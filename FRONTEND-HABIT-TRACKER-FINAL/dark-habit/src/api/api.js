import axios from 'axios';

const BASE = 'http://localhost:8083/api';

// ── Users ──────────────────────────────────────────
export const registerUser  = (data) => axios.post(`${BASE}/users/register`, data);
export const loginUser     = (data) => axios.post(`${BASE}/users/login`, data);
export const getUserById   = (id)   => axios.get(`${BASE}/users/${id}`);

// ── Habits ─────────────────────────────────────────
export const getHabits     = (userId)       => axios.get(`${BASE}/habits?userId=${userId}`);
export const createHabit   = (userId, data) => axios.post(`${BASE}/habits?userId=${userId}`, data);
export const updateHabit   = (id, data)     => axios.put(`${BASE}/habits/${id}`, data);
export const deleteHabit   = (id)           => axios.delete(`${BASE}/habits/${id}`);

// ── Tasks ──────────────────────────────────────────
export const getTasks      = (habitId)       => axios.get(`${BASE}/tasks?habitId=${habitId}`);
export const createTask    = (habitId, data) => axios.post(`${BASE}/tasks?habitId=${habitId}`, data);
export const updateTask    = (id, data)      => axios.put(`${BASE}/tasks/${id}`, data);
export const markTaskDone  = (id)            => axios.patch(`${BASE}/tasks/${id}/done`);
export const deleteTask    = (id)            => axios.delete(`${BASE}/tasks/${id}`);

// ── Reminders ──────────────────────────────────────
export const getReminders    = (taskId)       => axios.get(`${BASE}/reminders?taskId=${taskId}`);
export const createReminder  = (taskId, data) => axios.post(`${BASE}/reminders?taskId=${taskId}`, data);
export const deleteReminder  = (id)           => axios.delete(`${BASE}/reminders/${id}`);

// ── Habit Logs ─────────────────────────────────────
export const getLogs         = (taskId) => axios.get(`${BASE}/habit-logs?taskId=${taskId}`);
export const logHabit        = (taskId, data) => axios.post(`${BASE}/habit-logs?taskId=${taskId}`, data);
export const getStreak       = (taskId) => axios.get(`${BASE}/habit-logs/streak?taskId=${taskId}`);
export const getUserHistory  = (userId) => axios.get(`${BASE}/habit-logs/user/${userId}`);
