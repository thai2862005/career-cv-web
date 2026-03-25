import express, { Express } from 'express';
import { authenticate, isAdmin, isHR, isJobSeeker, isHROrAdmin } from '../middleware/auth';
import { uploadCV, uploadAvatar } from '../config/multer';

// Auth Controller
import * as authController from '../controller/auth';

// CV Controller
import * as cvController from '../controller/cv.controller';

// Company Controller
import * as companyController from '../controller/company.controller';

// Job Controller
import * as jobController from '../controller/job.controller';

// Application Controller
import * as applicationController from '../controller/application.controller';

// Notification Controller
import * as notificationController from '../controller/notification.controller';

// Email Controller
import * as emailController from '../controller/email.controller';

// Category Controller
import * as categoryController from '../controller/category.controller';

// Admin Controller
import * as adminController from '../controller/admin.controller';

const router = express.Router();

export const webRouterApi = (app: Express) => {
  app.use('/api/v1', router);

  // ============================================
  // AUTH ROUTES
  // ============================================
  router.post('/auth/register', authController.register);
  router.post('/auth/login', authController.login);
  router.get('/auth/profile', authenticate, authController.getProfile);
  router.put('/auth/profile', authenticate, authController.updateProfile);
  router.put('/auth/change-password', authenticate, authController.changePassword);

  // ============================================
  // CV ROUTES (Job Seeker)
  // ============================================
  router.post('/cv', authenticate, uploadCV.single('file'), cvController.uploadCV);
  router.get('/cv', authenticate, cvController.getMyCVs);
  router.get('/cv/:id', authenticate, cvController.getCVById);
  router.put('/cv/:id', authenticate, cvController.updateCV);
  router.delete('/cv/:id', authenticate, cvController.deleteCV);
  router.put('/cv/:id/default', authenticate, cvController.setDefaultCV);

  // ============================================
  // COMPANY ROUTES
  // ============================================
  // Public
  router.get('/companies', companyController.getAllCompanies);
  router.get('/companies/:id', companyController.getCompanyById);
  router.get('/companies/:id/reviews', companyController.getCompanyReviews);

  // HR only
  router.post('/companies', authenticate, isHR, companyController.createCompany);
  router.get('/hr/company', authenticate, isHR, companyController.getMyCompany);
  router.put('/companies/:id', authenticate, isHR, companyController.updateCompany);

  // Reviews (Job Seeker)
  router.post('/companies/reviews', authenticate, isJobSeeker, companyController.createReview);

  // Admin
  router.delete('/admin/companies/:id', authenticate, isAdmin, companyController.deleteCompany);
  router.put('/admin/companies/:id/verify', authenticate, isAdmin, companyController.verifyCompany);

  // ============================================
  // JOB ROUTES
  // ============================================
  // Public
  router.get('/jobs', jobController.getAllJobs);
  router.get('/jobs/:id', jobController.getJobById);

  // Job Seeker
  router.post('/jobs/:id/save', authenticate, isJobSeeker, jobController.saveJob);
  router.delete('/jobs/:id/save', authenticate, isJobSeeker, jobController.unsaveJob);
  router.get('/saved-jobs', authenticate, isJobSeeker, jobController.getSavedJobs);

  // HR only
  router.post('/hr/jobs', authenticate, isHR, jobController.createJobPost);
  router.get('/hr/jobs', authenticate, isHR, jobController.getMyJobs);
  router.put('/hr/jobs/:id', authenticate, isHR, jobController.updateJobPost);
  router.delete('/hr/jobs/:id', authenticate, isHR, jobController.deleteJobPost);
  router.put('/hr/jobs/:id/toggle', authenticate, isHR, jobController.toggleJobStatus);

  // Admin
  router.get('/admin/jobs/pending', authenticate, isAdmin, jobController.getPendingJobs);
  router.put('/admin/jobs/:id/approve', authenticate, isAdmin, jobController.approveJob);

  // ============================================
  // APPLICATION ROUTES
  // ============================================
  // Job Seeker
  router.post('/applications', authenticate, isJobSeeker, applicationController.applyForJob);
  router.get('/applications', authenticate, isJobSeeker, applicationController.getMyApplications);
  router.get('/applications/:id', authenticate, applicationController.getApplicationById);
  router.delete('/applications/:id', authenticate, isJobSeeker, applicationController.cancelApplication);

  // HR
  router.get('/hr/applications', authenticate, isHR, applicationController.getCompanyApplications);
  router.get('/hr/applications/stats', authenticate, isHR, applicationController.getApplicationStats);
  router.get('/hr/jobs/:jobId/applications', authenticate, isHR, applicationController.getJobApplications);
  router.put('/hr/applications/:id/status', authenticate, isHR, applicationController.updateApplicationStatus);
  router.get('/hr/candidates', authenticate, isHR, applicationController.searchCandidates);

  // ============================================
  // NOTIFICATION ROUTES
  // ============================================
  router.get('/notifications', authenticate, notificationController.getMyNotifications);
  router.put('/notifications/:id/read', authenticate, notificationController.markAsRead);
  router.put('/notifications/read-all', authenticate, notificationController.markAllAsRead);
  router.delete('/notifications/:id', authenticate, notificationController.deleteNotification);

  // Messages
  router.get('/messages', authenticate, notificationController.getMyMessages);
  router.post('/messages', authenticate, notificationController.createMessage);

  // ============================================
  // EMAIL ROUTES
  // ============================================
  // Public - Contact
  router.post('/contact', emailController.submitContact);

  // HR
  router.post('/hr/email/invitation', authenticate, isHR, emailController.sendInvitation);
  router.get('/email/history', authenticate, emailController.getEmailHistory);

  // Admin
  router.get('/admin/contacts', authenticate, isAdmin, emailController.getAllContacts);
  router.put('/admin/contacts/:id/resolve', authenticate, isAdmin, emailController.resolveContact);

  // ============================================
  // CATEGORY ROUTES
  // ============================================
  // Public
  router.get('/categories', categoryController.getAllCategories);
  router.get('/categories/:id', categoryController.getCategoryById);

  // Admin only
  router.post('/admin/categories', authenticate, isAdmin, categoryController.createCategory);
  router.put('/admin/categories/:id', authenticate, isAdmin, categoryController.updateCategory);
  router.delete('/admin/categories/:id', authenticate, isAdmin, categoryController.deleteCategory);
  router.put('/admin/categories/:id/toggle', authenticate, isAdmin, categoryController.toggleCategoryStatus);

  // ============================================
  // ADMIN ROUTES
  // ============================================
  router.get('/admin/dashboard', authenticate, isAdmin, adminController.getDashboardStats);
  router.get('/admin/users', authenticate, isAdmin, adminController.getAllUsers);
  router.get('/admin/users/:id', authenticate, isAdmin, adminController.getUserById);
  router.put('/admin/users/:id', authenticate, isAdmin, adminController.updateUser);
  router.put('/admin/users/:id/toggle', authenticate, isAdmin, adminController.toggleUserStatus);
  router.delete('/admin/users/:id', authenticate, isAdmin, adminController.deleteUser);
  router.put('/admin/users/:id/reset-password', authenticate, isAdmin, adminController.resetUserPassword);
  router.get('/admin/roles', authenticate, isAdmin, adminController.getAllRoles);
  router.get('/admin/reports', authenticate, isAdmin, adminController.getSystemReports);
  router.get('/admin/companies', authenticate, isAdmin, adminController.getAllCompanies);
};
