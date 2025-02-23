// Axios configuration for API requests
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://a9ca-161-73-255-39.ngrok-free.app',
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
