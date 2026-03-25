import axios from './axios.customize';

export const adminService = {
  // Get dashboard statistics
  getDashboard: async () => {
    return axios.get('/admin/dashboard');
  },

  // Get all users
  getUsers: async (params = {}) => {
    return axios.get('/admin/users', { params });
  },

  // Get user by ID
  getUserById: async (id) => {
    return axios.get(`/admin/users/${id}`);
  },

  // Update user
  updateUser: async (id, data) => {
    return axios.put(`/admin/users/${id}`, data);
  },

  // Toggle user status
  toggleUserStatus: async (id) => {
    return axios.put(`/admin/users/${id}/toggle`);
  },

  // Delete user
  deleteUser: async (id) => {
    return axios.delete(`/admin/users/${id}`);
  },

  // Reset user password
  resetPassword: async (id, data) => {
    return axios.put(`/admin/users/${id}/reset-password`, data);
  },

  // Get all roles
  getRoles: async () => {
    return axios.get('/admin/roles');
  },

  // Get system reports
  getReports: async (params = {}) => {
    return axios.get('/admin/reports', { params });
  },

  // Get contact submissions
  getContacts: async (params = {}) => {
    return axios.get('/admin/contacts', { params });
  },

  // Resolve contact
  resolveContact: async (id) => {
    return axios.put(`/admin/contacts/${id}/resolve`);
  },
};
