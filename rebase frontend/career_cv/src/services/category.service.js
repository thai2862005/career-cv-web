import axios from './axios.customize';

export const categoryService = {
  // Get all categories
  getCategories: async () => {
    return axios.get('/categories');
  },

  // Get category by ID
  getCategoryById: async (id) => {
    return axios.get(`/categories/${id}`);
  },

  // Admin: Create category
  createCategory: async (data) => {
    return axios.post('/admin/categories', data);
  },

  // Admin: Update category
  updateCategory: async (id, data) => {
    return axios.put(`/admin/categories/${id}`, data);
  },

  // Admin: Delete category
  deleteCategory: async (id) => {
    return axios.delete(`/admin/categories/${id}`);
  },

  // Admin: Toggle category status
  toggleCategory: async (id) => {
    return axios.put(`/admin/categories/${id}/toggle`);
  },
};
