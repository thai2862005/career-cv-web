import axios from './axios.customize';

export const cvService = {
  // Upload CV
  uploadCV: async (formData) => {
    return axios.post('/cv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get my CVs
  getMyCVs: async () => {
    return axios.get('/cv');
  },

  // Get CV by ID
  getCVById: async (id) => {
    return axios.get(`/cv/${id}`);
  },

  // Update CV
  updateCV: async (id, data) => {
    return axios.put(`/cv/${id}`, data);
  },

  // Delete CV
  deleteCV: async (id) => {
    return axios.delete(`/cv/${id}`);
  },

  // Set default CV
  setDefaultCV: async (id) => {
    return axios.put(`/cv/${id}/default`);
  },
};
