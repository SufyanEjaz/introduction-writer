// API calls for authentication
import api from '../api/api';

export const login = async (email: string, password: string) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const register = async (email: string, password: string, fullName: string, confirm_password: string) => {
  const response = await api.post('/register', { email, password, name: fullName, confirm_password });
  return response.data;
};

export const getIntroduction = async (payload: object) => {
  const response = await api.post('/get-introduction', payload);
  return response.data;
};