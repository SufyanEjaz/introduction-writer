import api from '@/api/api';

/**
 * Login call (example)
 */
export const login = async () => {
  // If you have a real endpoint, do: 
  // const response = await api.post('/login', { username, password });
  // return response.data;
  
  // Mocked response:
  return {
    id: 1,
    username: 'emilys',
    email: 'emily.johnson@x.dummyjson.com',
    firstName: 'Emily',
    lastName: 'Johnson',
    token: 'eyFakeJwt...',
    refreshToken: 'eyFakeRefresh...',
  };
};

/**
 * Register call (example)
 */
export const register = async (
  email: string,
  password: string,
  fullName: string,
  confirm_password: string
) => {
  const response = await api.post('/register', {
    email,
    password,
    name: fullName,
    confirm_password,
  });
  return response.data;
};

/**
 * getIntroduction - sends either FormData or JSON 
 * to `/get-introduction` endpoint, depending on payload type.
 */
export const getIntroduction = async (
  payload: FormData | Record<string, unknown>
) => {
  const headers = payload instanceof FormData 
    ? { 'Content-Type': 'multipart/form-data' }
    : {};

  const response = await api.post('/get-introduction', payload, { headers });
  return response.data;
};

/**
 * Basic Auth Helpers
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const logout = () => {
  localStorage.removeItem('token');
};
