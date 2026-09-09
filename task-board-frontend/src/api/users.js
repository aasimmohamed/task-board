import api from './axios';

export const getUsers = () => api.get('/users').then((res) => res.data);