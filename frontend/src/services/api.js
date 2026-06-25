// src/api/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ✅ CORRECT - Only replace /api at the END of the string
const BASE_URL = API_URL.replace(/\/api$/, '');

// Or even simpler - just hardcode or split properly:
// const BASE_URL = 'https://api.justiceodije.online';

const API_BASE_URL = `${BASE_URL}/api`;

console.log('VITE_API_URL:', API_URL);
console.log('BASE_URL:', BASE_URL);
console.log('API_BASE_URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

api.getCsrfCookie = () => {
  return axios.get(`${BASE_URL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
};

export default api;