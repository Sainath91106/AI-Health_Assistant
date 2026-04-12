import apiClient from './apiClient';

export const loginUser = async (payload) => {
  const response = await apiClient.post('/api/auth/login', payload);
  return response.data;
};

export const registerUser = async (payload) => {
  const response = await apiClient.post('/api/auth/register', payload);
  return response.data;
};
