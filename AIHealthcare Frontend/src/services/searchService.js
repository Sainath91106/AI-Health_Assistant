import apiClient from './apiClient';

export const searchPrescriptions = async (query) => {
  const response = await apiClient.post('/api/search', { query });
  return response.data;
};
