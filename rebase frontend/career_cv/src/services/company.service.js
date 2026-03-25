import axios from './axios.customize';

export const companyService = {
  // Get all companies
  getCompanies: async (params = {}) => {
    return axios.get('/companies', { params });
  },

  // Get company by ID
  getCompanyById: async (id) => {
    return axios.get(`/companies/${id}`);
  },

  // Get company reviews
  getCompanyReviews: async (id) => {
    return axios.get(`/companies/${id}/reviews`);
  },

  // Create company review (job seeker)
  createReview: async (data) => {
    return axios.post('/companies/reviews', data);
  },

  // HR: Create company
  createCompany: async (data) => {
    return axios.post('/companies', data);
  },

  // HR: Get my company
  getMyCompany: async () => {
    return axios.get('/hr/company');
  },

  // HR: Update company
  updateCompany: async (id, data) => {
    return axios.put(`/companies/${id}`, data);
  },

  // Admin: Get all companies
  getAllCompanies: async (params = {}) => {
    return axios.get('/admin/companies', { params });
  },

  // Admin: Delete company
  deleteCompany: async (id) => {
    return axios.delete(`/admin/companies/${id}`);
  },

  // Admin: Verify company
  verifyCompany: async (id, data) => {
    return axios.put(`/admin/companies/${id}/verify`, data);
  },
};
