import api from './axios';

export const getTasks = () => api.get('/tasks').then((res) => res.data);

export const createTask = (title, description) =>
  api.post('/tasks', { title, description }).then((res) => res.data);

export const updateTaskStatus = (id, status) =>
  api.patch(`/tasks/${id}/status`, { status }).then((res) => res.data);

export const assignTask = (id, userId) =>
  api.patch(`/tasks/${id}/assign`, userId ? { userId } : {}).then((res) => res.data);

export const deleteTask = (id) => api.delete(`/tasks/${id}`).then((res) => res.data);