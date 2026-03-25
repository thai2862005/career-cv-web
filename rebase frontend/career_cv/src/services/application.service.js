import axios from './axios.customize';

export const applicationService = {
  // Job Seeker: Apply for job
  applyJob: async (data) => {
    return axios.post('/applications', data);
  },

  // Job Seeker: Get my applications
  getMyApplications: async (params = {}) => {
    return axios.get('/applications', { params });
  },

  // Get application by ID
  getApplicationById: async (id) => {
    return axios.get(`/applications/${id}`);
  },

  // Job Seeker: Cancel application
  cancelApplication: async (id) => {
    return axios.delete(`/applications/${id}`);
  },

  // HR: Get all company applications
  getCompanyApplications: async (params = {}) => {
    return axios.get('/hr/applications', { params });
  },

  // HR: Get application statistics
  getApplicationStats: async () => {
    return axios.get('/hr/applications/stats');
  },

  // HR: Get applications for specific job
  getJobApplications: async (jobId, params = {}) => {
    return axios.get(`/hr/jobs/${jobId}/applications`, { params });
  },

  // HR: Update application status
  updateApplicationStatus: async (id, data) => {
    return axios.put(`/hr/applications/${id}/status`, data);
  },

  // HR: Search candidates
  searchCandidates: async (params = {}) => {
    return axios.get('/hr/candidates', { params });
  },
};
