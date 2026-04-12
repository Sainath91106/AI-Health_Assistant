import apiClient from './apiClient';

export const generateDietPlan = async (goal) => {
  const response = await apiClient.post('/api/diet/generate', { goal });
  return response.data;
};

export const getUserDietPlans = async (userId) => {
  const response = await apiClient.get(`/api/diet/user/${userId}`);
  return response.data;
};

export const deleteDietPlan = async (dietId) => {
  const response = await apiClient.delete(`/api/diet/${dietId}`);
  return response.data;
};
