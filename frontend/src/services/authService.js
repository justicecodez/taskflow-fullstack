import api from "./api";

export const authService = {
  login: async (credentials) => {
    await api.getCsrfCookie();
    const response = await api.post('/login', credentials);
    return response.data;
  },

  register: async (data) => {
    await api.getCsrfCookie();
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