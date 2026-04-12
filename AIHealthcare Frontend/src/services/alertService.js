import apiClient from './apiClient';

export const getSmartAlerts = async () => {
  const response = await apiClient.get('/api/alerts');
  return response.data;
};
