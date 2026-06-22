import api from './api';

export const taskService = {
  getAll: async (params) => {
    // params can contain status and priority
    const response = await api.get('/task', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/task/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/task', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/task/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/task/${id}`);
    return response.data;
  },
};
