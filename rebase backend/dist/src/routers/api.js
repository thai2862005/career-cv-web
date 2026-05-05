"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webRouterApi = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const multer_1 = require("../config/multer");
// Auth Controller
const authController = __importStar(require("../controller/auth"));
// CV Controller
const cvController = __importStar(require("../controller/cv.controller"));
// Company Controller
const companyController = __importStar(require("../controller/company.controller"));
// Job Controller
const jobController = __importStar(require("../controller/job.controller"));
// Application Controller
const applicationController = __importStar(require("../controller/application.controller"));
// Notification Controller
const notificationController = __importStar(require("../controller/notification.controller"));
// Email Controller
const emailController = __importStar(require("../controller/email.controller"));
// Category Controller
const categoryController = __importStar(require("../controller/category.controller"));
// Admin Controller
const adminController = __importStar(require("../controller/admin.controller"));
const router = express_1.default.Router();
const webRouterApi = (app) => {
    app.use("/api/v1", router);
    // ============================================
    // AUTH ROUTES
    // ============================================
    router.post("/auth/register", authController.register);
    router.post("/auth/login", authController.login);
    router.get("/auth/profile", auth_1.authenticate, authController.getProfile);
    router.put("/auth/profile", auth_1.authenticate, authController.updateProfile);
    router.put("/auth/change-password", auth_1.authenticate, authController.changePassword);
    // ============================================
    // CV ROUTES (Job Seeker)
    // ============================================
    router.post("/cv", auth_1.authenticate, multer_1.uploadCV.single("file"), cvController.uploadCV);
    router.get("/cv", auth_1.authenticate, cvController.getMyCVs);
    router.get("/cv/:id", auth_1.authenticate, cvController.getCVById);
    router.put("/cv/:id", auth_1.authenticate, cvController.updateCV);
    router.delete("/cv/:id", auth_1.authenticate, cvController.deleteCV);
    router.put("/cv/:id/default", auth_1.authenticate, cvController.setDefaultCV);
    // ============================================
    // COMPANY ROUTES
    // ============================================
    // Public
    router.get("/companies", companyController.getAllCompanies);
    router.get("/companies/:id", companyController.getCompanyById);
    router.get("/companies/:id/reviews", companyController.getCompanyReviews);
    // HR only
    router.post("/companies", auth_1.authenticate, auth_1.isHR, companyController.createCompany);
    router.get("/hr/company", auth_1.authenticate, auth_1.isHR, companyController.getMyCompany);
    router.put("/companies/:id", auth_1.authenticate, auth_1.isHR, companyController.updateCompany);
    // Reviews (Job Seeker)
    router.post("/companies/reviews", auth_1.authenticate, auth_1.isJobSeeker, companyController.createReview);
    // Admin
    router.delete("/admin/companies/:id", auth_1.authenticate, auth_1.isAdmin, companyController.deleteCompany);
    router.put("/admin/companies/:id/verify", auth_1.authenticate, auth_1.isAdmin, companyController.verifyCompany);
    // ============================================
    // JOB ROUTES
    // ============================================
    // Public
    router.get("/jobs", jobController.getAllJobs);
    router.get("/jobs/:id", jobController.getJobById);
    // Job Seeker
    router.post("/jobs/:id/save", auth_1.authenticate, auth_1.isJobSeeker, jobController.saveJob);
    router.delete("/jobs/:id/save", auth_1.authenticate, auth_1.isJobSeeker, jobController.unsaveJob);
    router.get("/saved-jobs", auth_1.authenticate, auth_1.isJobSeeker, jobController.getSavedJobs);
    // HR only
    router.post("/hr/jobs", auth_1.authenticate, auth_1.isHR, jobController.createJobPost);
    router.get("/hr/jobs", auth_1.authenticate, auth_1.isHR, jobController.getMyJobs);
    router.put("/hr/jobs/:id", auth_1.authenticate, auth_1.isHR, jobController.updateJobPost);
    router.delete("/hr/jobs/:id", auth_1.authenticate, auth_1.isHR, jobController.deleteJobPost);
    router.put("/hr/jobs/:id/toggle", auth_1.authenticate, auth_1.isHR, jobController.toggleJobStatus);
    // Admin
    router.get("/admin/jobs", auth_1.authenticate, auth_1.isAdmin, jobController.getAllJobsAdmin);
    router.get("/admin/jobs/pending", auth_1.authenticate, auth_1.isAdmin, jobController.getPendingJobs);
    router.put("/admin/jobs/:id/reject", auth_1.authenticate, auth_1.isAdmin, jobController.rejectJob);
    router.put("/admin/jobs/:id/approve", auth_1.authenticate, auth_1.isAdmin, jobController.approveJob);
    router.put("/admin/jobs/:id", auth_1.authenticate, auth_1.isAdmin, jobController.updateJobAdmin);
    router.delete("/admin/jobs/:id", auth_1.authenticate, auth_1.isAdmin, jobController.deleteJobAdmin);
    // ============================================
    // APPLICATION ROUTES
    // ============================================
    // Job Seeker
    router.post("/applications", auth_1.authenticate, auth_1.isJobSeeker, applicationController.applyForJob);
    router.get("/applications", auth_1.authenticate, auth_1.isJobSeeker, applicationController.getMyApplications);
    router.get("/applications/:id", auth_1.authenticate, applicationController.getApplicationById);
    router.delete("/applications/:id", auth_1.authenticate, auth_1.isJobSeeker, applicationController.cancelApplication);
    // HR
    router.get("/hr/applications", auth_1.authenticate, auth_1.isHR, applicationController.getCompanyApplications);
    router.get("/hr/applications/stats", auth_1.authenticate, auth_1.isHR, applicationController.getApplicationStats);
    router.get("/hr/jobs/:jobId/applications", auth_1.authenticate, auth_1.isHR, applicationController.getJobApplications);
    router.put("/hr/applications/:id/status", auth_1.authenticate, auth_1.isHR, applicationController.updateApplicationStatus);
    router.get("/hr/candidates", auth_1.authenticate, auth_1.isHR, applicationController.searchCandidates);
    // ============================================
    // NOTIFICATION ROUTES
    // ============================================
    router.get("/notifications", auth_1.authenticate, notificationController.getMyNotifications);
    router.put("/notifications/:id/read", auth_1.authenticate, notificationController.markAsRead);
    router.put("/notifications/read-all", auth_1.authenticate, notificationController.markAllAsRead);
    router.delete("/notifications/:id", auth_1.authenticate, notificationController.deleteNotification);
    // Messages
    router.get("/messages", auth_1.authenticate, notificationController.getMyMessages);
    router.post("/messages", auth_1.authenticate, notificationController.createMessage);
    // ============================================
    // EMAIL ROUTES
    // ============================================
    // Public - Contact
    router.post("/contact", emailController.submitContact);
    // HR
    router.post("/hr/email/invitation", auth_1.authenticate, auth_1.isHR, emailController.sendInvitation);
    router.get("/email/history", auth_1.authenticate, emailController.getEmailHistory);
    // Admin
    router.get("/admin/contacts", auth_1.authenticate, auth_1.isAdmin, emailController.getAllContacts);
    router.put("/admin/contacts/:id/resolve", auth_1.authenticate, auth_1.isAdmin, emailController.resolveContact);
    // ============================================
    // CATEGORY ROUTES
    // ============================================
    // Public
    router.get("/categories", categoryController.getAllCategories);
    router.get("/categories/:id", categoryController.getCategoryById);
    // Admin only
    router.post("/admin/categories", auth_1.authenticate, auth_1.isAdmin, categoryController.createCategory);
    router.put("/admin/categories/:id", auth_1.authenticate, auth_1.isAdmin, categoryController.updateCategory);
    router.delete("/admin/categories/:id", auth_1.authenticate, auth_1.isAdmin, categoryController.deleteCategory);
    router.put("/admin/categories/:id/toggle", auth_1.authenticate, auth_1.isAdmin, categoryController.toggleCategoryStatus);
    // ============================================
    // ADMIN ROUTES
    // ============================================
    router.get("/admin/dashboard", auth_1.authenticate, auth_1.isAdmin, adminController.getDashboardStats);
    router.get("/admin/users", auth_1.authenticate, auth_1.isAdmin, adminController.getAllUsers);
    router.get("/admin/users/:id", auth_1.authenticate, auth_1.isAdmin, adminController.getUserById);
    router.put("/admin/users/:id", auth_1.authenticate, auth_1.isAdmin, adminController.updateUser);
    router.put("/admin/users/:id/toggle", auth_1.authenticate, auth_1.isAdmin, adminController.toggleUserStatus);
    router.delete("/admin/users/:id", auth_1.authenticate, auth_1.isAdmin, adminController.deleteUser);
    router.put("/admin/users/:id/reset-password", auth_1.authenticate, auth_1.isAdmin, adminController.resetUserPassword);
    router.get("/admin/roles", auth_1.authenticate, auth_1.isAdmin, adminController.getAllRoles);
    router.get("/admin/reports", auth_1.authenticate, auth_1.isAdmin, adminController.getSystemReports);
    router.get("/admin/companies", auth_1.authenticate, auth_1.isAdmin, adminController.getAllCompanies);
};
exports.webRouterApi = webRouterApi;
//# sourceMappingURL=api.js.map