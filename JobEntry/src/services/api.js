// API Service - Frontend API calls to Backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

/**
 * Generic API request handler
 */
const apiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    headers = {},
    token = null,
  } = options;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add authorization token if available
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config = {
    method,
    headers: defaultHeaders,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'An error occurred',
        data,
      };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Network error',
      details: error,
    };
  }
};

// ============================================
// AUTH ENDPOINTS
// ============================================
export const authAPI = {
  register: (userData) =>
    apiRequest('/auth/register', { method: 'POST', body: userData }),

  login: (credentials) =>
    apiRequest('/auth/login', { method: 'POST', body: credentials }),

  getProfile: (token) =>
    apiRequest('/auth/profile', { token }),

  updateProfile: (profileData, token) =>
    apiRequest('/auth/profile', { method: 'PUT', body: profileData, token }),

  changePassword: (passwordData, token) =>
    apiRequest('/auth/change-password', { method: 'PUT', body: passwordData, token }),
};

// ============================================
// JOB ENDPOINTS
// ============================================
export const jobAPI = {
  getAllJobs: () =>
    apiRequest('/jobs'),

  getJobById: (id) =>
    apiRequest(`/jobs/${id}`),

  saveJob: (jobId, token) =>
    apiRequest(`/jobs/${jobId}/save`, { method: 'POST', token }),

  unsaveJob: (jobId, token) =>
    apiRequest(`/jobs/${jobId}/save`, { method: 'DELETE', token }),

  getSavedJobs: (token) =>
    apiRequest('/saved-jobs', { token }),

  // HR only
  createJob: (jobData, token) =>
    apiRequest('/hr/jobs', { method: 'POST', body: jobData, token }),

  getMyJobs: (token) =>
    apiRequest('/hr/jobs', { token }),

  updateJob: (jobId, jobData, token) =>
    apiRequest(`/hr/jobs/${jobId}`, { method: 'PUT', body: jobData, token }),

  deleteJob: (jobId, token) =>
    apiRequest(`/hr/jobs/${jobId}`, { method: 'DELETE', token }),

  toggleJobStatus: (jobId, token) =>
    apiRequest(`/hr/jobs/${jobId}/toggle`, { method: 'PUT', token }),

  // Admin only
  getPendingJobs: (token) =>
    apiRequest('/admin/jobs/pending', { token }),

  approveJob: (jobId, token) =>
    apiRequest(`/admin/jobs/${jobId}/approve`, { method: 'PUT', token }),

  rejectJob: (jobId, reason, token) =>
    apiRequest(`/admin/jobs/${jobId}/reject`, { method: 'PUT', body: { reason }, token }),
};

// ============================================
// COMPANY ENDPOINTS
// ============================================
export const companyAPI = {
  getAllCompanies: () =>
    apiRequest('/companies'),

  getCompanyById: (id) =>
    apiRequest(`/companies/${id}`),

  getCompanyReviews: (id) =>
    apiRequest(`/companies/${id}/reviews`),

  createCompany: (companyData, token) =>
    apiRequest('/companies', { method: 'POST', body: companyData, token }),

  getMyCompany: (token) =>
    apiRequest('/hr/company', { token }),

  updateCompany: (companyId, companyData, token) =>
    apiRequest(`/companies/${companyId}`, { method: 'PUT', body: companyData, token }),

  createReview: (reviewData, token) =>
    apiRequest('/companies/reviews', { method: 'POST', body: reviewData, token }),

  // Admin only
  deleteCompany: (companyId, token) =>
    apiRequest(`/admin/companies/${companyId}`, { method: 'DELETE', token }),

  verifyCompany: (companyId, token) =>
    apiRequest(`/admin/companies/${companyId}/verify`, { method: 'PUT', token }),
};

// ============================================
// USER MANAGEMENT ENDPOINTS (Admin only)
// ============================================
export const userAPI = {
  getAllUsers: (token) =>
    apiRequest('/admin/users', { token }),

  getUserById: (userId, token) =>
    apiRequest(`/admin/users/${userId}`, { token }),

  updateUser: (userId, userData, token) =>
    apiRequest(`/admin/users/${userId}`, { method: 'PUT', body: userData, token }),

  deleteUser: (userId, token) =>
    apiRequest(`/admin/users/${userId}`, { method: 'DELETE', token }),

  lockUser: (userId, token) =>
    apiRequest(`/admin/users/${userId}/lock`, { method: 'PUT', token }),

  unlockUser: (userId, token) =>
    apiRequest(`/admin/users/${userId}/unlock`, { method: 'PUT', token }),

  sendMessage: (userId, message, token) =>
    apiRequest(`/admin/users/${userId}/message`, { method: 'POST', body: { message }, token }),
};

// ============================================
// CV ENDPOINTS
// ============================================
export const cvAPI = {
  uploadCV: (formData, token) =>
    apiRequest('/cv', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
      token,
    }),

  getMyCVs: (token) =>
    apiRequest('/cv', { token }),

  getCVById: (cvId, token) =>
    apiRequest(`/cv/${cvId}`, { token }),

  updateCV: (cvId, cvData, token) =>
    apiRequest(`/cv/${cvId}`, { method: 'PUT', body: cvData, token }),

  deleteCV: (cvId, token) =>
    apiRequest(`/cv/${cvId}`, { method: 'DELETE', token }),

  setDefaultCV: (cvId, token) =>
    apiRequest(`/cv/${cvId}/default`, { method: 'PUT', token }),
};

// ============================================
// APPLICATION ENDPOINTS
// ============================================
export const applicationAPI = {
  submitApplication: (applicationData, token) =>
    apiRequest('/applications', { method: 'POST', body: applicationData, token }),

  getMyApplications: (token) =>
    apiRequest('/applications', { token }),

  getApplicationById: (appId, token) =>
    apiRequest(`/applications/${appId}`, { token }),

  withdrawApplication: (appId, token) =>
    apiRequest(`/applications/${appId}`, { method: 'DELETE', token }),

  // HR only
  getApplicationsForJob: (jobId, token) =>
    apiRequest(`/hr/jobs/${jobId}/applications`, { token }),

  updateApplicationStatus: (appId, status, token) =>
    apiRequest(`/applications/${appId}`, { method: 'PUT', body: { status }, token }),
};

// ============================================
// CATEGORY ENDPOINTS
// ============================================
export const categoryAPI = {
  getAllCategories: () =>
    apiRequest('/categories'),

  getCategoryById: (id) =>
    apiRequest(`/categories/${id}`),

  // Admin only
  createCategory: (categoryData, token) =>
    apiRequest('/categories', { method: 'POST', body: categoryData, token }),

  updateCategory: (categoryId, categoryData, token) =>
    apiRequest(`/categories/${categoryId}`, { method: 'PUT', body: categoryData, token }),

  deleteCategory: (categoryId, token) =>
    apiRequest(`/categories/${categoryId}`, { method: 'DELETE', token }),
};

// ============================================
// NOTIFICATION ENDPOINTS
// ============================================
export const notificationAPI = {
  getNotifications: (token) =>
    apiRequest('/notifications', { token }),

  markAsRead: (notificationId, token) =>
    apiRequest(`/notifications/${notificationId}`, { method: 'PUT', token }),

  markAllAsRead: (token) =>
    apiRequest('/notifications/mark-all-read', { method: 'PUT', token }),

  deleteNotification: (notificationId, token) =>
    apiRequest(`/notifications/${notificationId}`, { method: 'DELETE', token }),
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Store authentication token in localStorage
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  }
};

/**
 * Get authentication token from localStorage
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Remove authentication token
 */
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

export default {
  authAPI,
  jobAPI,
  companyAPI,
  cvAPI,
  applicationAPI,
  categoryAPI,
  notificationAPI,
  userAPI,
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  isAuthenticated,
};
