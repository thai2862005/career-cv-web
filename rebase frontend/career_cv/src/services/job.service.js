import axios from './axios.customize';

export const jobService = {
  // Get all jobs with filters
  getJobs: async (params = {}) => {
    return axios.get('/jobs', { params });
  },

  // Get job by ID
  getJobById: async (id) => {
    return axios.get(`/jobs/${id}`);
  },

  // Save job (for job seekers)
  saveJob: async (jobId) => {
    return axios.post(`/jobs/${jobId}/save`);
  },

  // Unsave job
  unsaveJob: async (jobId) => {
    return axios.delete(`/jobs/${jobId}/save`);
  },

  // Get saved jobs
  getSavedJobs: async () => {
    return axios.get('/saved-jobs');
  },

  // HR: Create job post
  createJob: async (data) => {
    return axios.post('/hr/jobs', data);
  },

  // HR: Get my job posts
  getMyJobs: async (params = {}) => {
    return axios.get('/hr/jobs', { params });
  },

  // HR: Update job post
  updateJob: async (id, data) => {
    return axios.put(`/hr/jobs/${id}`, data);
  },

  // HR: Delete job post
  deleteJob: async (id) => {
    return axios.delete(`/hr/jobs/${id}`);
  },

  // HR: Toggle job status
  toggleJobStatus: async (id) => {
    return axios.put(`/hr/jobs/${id}/toggle`);
  },

  // Admin: Get pending jobs
  getPendingJobs: async (params = {}) => {
    return axios.get('/admin/jobs/pending', { params });
  },

  // Admin: Approve/Reject job
  approveJob: async (id, data) => {
    return axios.put(`/admin/jobs/${id}/approve`, data);
  },
};
