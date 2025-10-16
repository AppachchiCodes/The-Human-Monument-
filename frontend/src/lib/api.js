import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// API methods
export const contributionAPI = {
  // Get all contributions
  getAll: async (page = 1, limit = 100) => {
    return apiClient.get('/contributions', { params: { page, limit } });
  },

  // Get contribution by short ID
  getByShortId: async (shortId) => {
    return apiClient.get(`/contributions/${shortId}`);
  },

  // Create text contribution
  createText: async (content) => {
    return apiClient.post('/contributions', {
      type: 'TEXT',
      content,
    });
  },

  // Create drawing contribution
  createDrawing: async (drawingDataUrl) => {
    return apiClient.post('/contributions', {
      type: 'DRAWING',
      drawing: drawingDataUrl,
    });
  },

  // Create image contribution
  createImage: async (file) => {
    const formData = new FormData();
    formData.append('type', 'IMAGE');
    formData.append('image', file);

    return apiClient.post('/contributions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Create audio contribution
  createAudio: async (audioBlob) => {
    const formData = new FormData();
    formData.append('type', 'AUDIO');
    formData.append('audio', audioBlob, 'recording.webm');

    return apiClient.post('/contributions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Get stats
  getStats: async () => {
    return apiClient.get('/contributions/stats');
  },
};

export default apiClient;