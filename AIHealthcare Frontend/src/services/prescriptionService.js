import apiClient from './apiClient';

export const uploadPrescription = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/api/prescriptions/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });

  return response.data;
};

export const getUserPrescriptions = async (userId) => {
  const response = await apiClient.get(`/api/prescriptions/user/${userId}`);
  return response.data;
};

export const deletePrescription = async (prescriptionId) => {
  const response = await apiClient.delete(`/api/prescriptions/${prescriptionId}`);
  return response.data;
};
