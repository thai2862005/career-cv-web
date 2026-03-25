import axios from './axios.customize';

export const authService = {
  // Register new user
  register: async (data) => {
    return axios.post('/auth/register', data);
  },

  // Login user
  login: async (data) => {
    return axios.post('/auth/login', data);
  },

  // Get current user profile
  getProfile: async () => {
    return axios.get('/auth/profile');
  },

  // Update user profile
  updateProfile: async (data) => {
    return axios.put('/auth/profile', data);
  },

  // Change password
  changePassword: async (data) => {
    return axios.put('/auth/change-password', data);
  },
};
