import apiClient from './apiClient';

export const sendChatMessage = async (message) => {
  const response = await apiClient.post('/api/chat', { message });
  return response.data;
};
