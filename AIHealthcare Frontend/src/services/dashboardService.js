import apiClient from './apiClient';

export const getDashboardStats = async () => {
  const response = await apiClient.get('/api/dashboard');
  return response.data;
};