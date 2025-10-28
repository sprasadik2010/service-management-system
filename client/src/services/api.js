import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const serviceRequestAPI = {
  getAll: () => api.get('/service-requests'),
  getById: (id) => api.get(`/service-requests/${id}`),
  create: (formData) => api.post('/service-requests/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.patch(`/service-requests/${id}`, data),
  getActivities: (id) => api.get(`/service-requests/${id}/activities`),
};

export const departmentAPI = {
  getAll: () => api.get('/departments'),
};

export const userAPI = {
  create: (data) => api.post('/users/', data),
};