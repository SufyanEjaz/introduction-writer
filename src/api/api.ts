// Axios configuration for API requests
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
