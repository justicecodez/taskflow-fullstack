import api from './api';
import axios from 'axios';

// Sanctum CSRF endpoint is usually at the root domain /sanctum/csrf-cookie
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:8000',
  withCredentials: true,
});

export const authService = {
  getCsrfCookie: async () => {
    return await apiClient.get('/sanctum/csrf-cookie');
  },
  login: async (credentials) => {
    await authService.getCsrfCookie();
    const response = await api.post('/login', credentials);
    return response.data;
  },
  register: async (data) => {
    await authService.getCsrfCookie();
    const response = await api.post('/register', data);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },
  getUser: async () => {
    const response = await api.get('/user');
    return response.data;
  },
};
