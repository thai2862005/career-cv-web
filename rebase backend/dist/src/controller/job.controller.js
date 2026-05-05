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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSavedJobs = exports.unsaveJob = exports.saveJob = exports.deleteJobAdmin = exports.updateJobAdmin = exports.getAllJobsAdmin = exports.rejectJob = exports.getPendingJobs = exports.approveJob = exports.getMyJobs = exports.toggleJobStatus = exports.deleteJobPost = exports.updateJobPost = exports.getJobById = exports.getAllJobs = exports.createJobPost = void 0;
const jobService = __importStar(require("../service/job.service"));
const job_1 = require("../validation/job");
const zod_1 = require("zod");
const client_1 = require("../config/client");
// Create job post
const createJobPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Chưa đăng nhập" });
            return;
        }
        // Get company of HR user
        const company = yield client_1.prisma.company.findFirst({
            where: { hrUserId: req.user.id },
        });
        if (!company) {
            res.status(400).json({ success: false, message: "Bạn chưa có công ty" });
            return;
        }
        const validatedData = job_1.createJobPostSchema.parse(req.body);
        const job = yield jobService.createJobPost(company.id, validatedData);
        res.status(201).json({
            success: true,
            message: "Tạo tin tuyển dụng thành công. Đang chờ duyệt.",
            data: job,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({
                success: false,
                message: "Dữ liệu không hợp lệ",
                errors: error.errors,
            });
            return;
        }
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Tạo tin thất bại",
        });
    }
});
exports.createJobPost = createJobPost;
// Get all jobs (public search)
const getAllJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = job_1.searchJobSchema.parse({
            keyword: req.query.keyword,
            location: req.query.location,
            categoryId: req.query.categoryId
                ? parseInt(req.query.categoryId)
                : undefined,
            jobType: req.query.jobType,
            salaryMin: req.query.salaryMin
                ? parseFloat(req.query.salaryMin)
                : undefined,
            salaryMax: req.query.salaryMax
                ? parseFloat(req.query.salaryMax)
                : undefined,
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        });
        const result = yield jobService.getAllJobPosts(filters);
        res.status(200).json({
            success: true,
            data: result.jobs,
            meta: result.meta,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Lấy danh sách thất bại",
        });
    }
});
exports.getAllJobs = getAllJobs;
// Get job by ID
const getJobById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = parseInt(req.params.id);
        const job = yield jobService.getJobPostById(jobId);
        res.status(200).json({
            success: true,
            data: job,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Không tìm thấy",
        });
    }
});
exports.getJobById = getJobById;
// Update job post
const updateJobPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Chưa đăng nhập" });
            return;
        }
        const company = yield client_1.prisma.company.findFirst({
            where: { hrUserId: req.user.id },
        });
        if (!company) {
            res.status(400).json({ success: false, message: "Bạn chưa có công ty" });
            return;
        }
        const jobId = parseInt(req.params.id);
        const validatedData = job_1.updateJobPostSchema.parse(req.body);
        const job = yield jobService.updateJobPost(jobId, company.id, validatedData);
        res.status(200).json({
            success: true,
            message: "Cập nhật tin thành công",
            data: job,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({
                success: false,
                message: "Dữ liệu không hợp lệ",
                errors: error.errors,
            });
            return;
        }
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Cập nhật thất bại",
        });
    }
});
exports.updateJobPost = updateJobPost;
// Delete job post
const deleteJobPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Chưa đăng nhập" });
            return;
        }
        const company = yield client_1.prisma.company.findFirst({
            where: { hrUserId: req.user.id },
        });
        if (!company) {
            res.status(400).json({ success: false, message: "Bạn chưa có công ty" });
            return;
        }
        const jobId = parseInt(req.params.id);
        const result = yield jobService.deleteJobPost(jobId, company.id);
        res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Xóa thất bại",
        });
    }
});
exports.deleteJobPost = deleteJobPost;
// Toggle job status
const toggleJobStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Chưa đăng nhập" });
            return;
        }
        const company = yield client_1.prisma.company.findFirst({
            where: { hrUserId: req.user.id },
        });
        if (!company) {
            res.status(400).json({ success: false, message: "Bạn chưa có công ty" });
            return;
        }
        const jobId = parseInt(req.params.id);
        const job = yield jobService.toggleJobStatus(jobId, company.id);
        res.status(200).json({
            success: true,
            message: job.isActive ? "Đã bật tin" : "Đã tắt tin",
            data: job,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Cập nhật thất bại",
        });
    }
});
exports.toggleJobStatus = toggleJobStatus;
// Get company jobs (HR)
const getMyJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Chưa đăng nhập" });
            return;
        }
        const company = yield client_1.prisma.company.findFirst({
            where: { hrUserId: req.user.id },
        });
        if (!company) {
            res
                .status(200)
                .json({
                success: true,
                data: [],
                meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
            });
            return;
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = yield jobService.getCompanyJobs(company.id, page, limit);
        res.status(200).json({
            success: true,
            data: result.jobs,
            meta: result.meta,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Lấy danh sách thất bại",
        });
    }
});
exports.getMyJobs = getMyJobs;
// Approve job (Admin)
const approveJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = parseInt(req.params.id);
        const { isApproved } = req.body;
        const approvedValue = typeof isApproved === "boolean" ? isApproved : true;
        const job = yield jobService.approveJobPost(jobId, approvedValue);
        res.status(200).json({
            success: true,
            message: approvedValue
                ? "Duyệt tin thành công"
                : "Từ chối tin tuyển dụng",
            data: job,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Cập nhật thất bại",
        });
    }
});
exports.approveJob = approveJob;
// Get pending jobs (Admin)
const getPendingJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = yield jobService.getPendingJobs(page, limit);
        res.status(200).json({
            success: true,
            data: result.jobs,
            meta: result.meta,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Lấy danh sách thất bại",
        });
    }
});
exports.getPendingJobs = getPendingJobs;
// Reject job (Admin)
const rejectJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = parseInt(req.params.id);
        const job = yield jobService.approveJobPost(jobId, false);
        res.status(200).json({
            success: true,
            message: "Từ chối tin tuyển dụng",
            data: job,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Từ chối thất bại",
        });
    }
});
exports.rejectJob = rejectJob;
// Get all jobs (Admin)
const getAllJobsAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const result = yield jobService.getAllJobsAdmin(page, limit);
        res.status(200).json({
            success: true,
            data: result.jobs,
            meta: result.meta,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Lấy danh sách thất bại",
        });
    }
});
exports.getAllJobsAdmin = getAllJobsAdmin;
// Update job (Admin)
const updateJobAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = parseInt(req.params.id);
        const validatedData = job_1.updateJobPostSchema.parse(req.body);
        const job = yield jobService.updateJobPostAdmin(jobId, validatedData);
        res.status(200).json({
            success: true,
            message: "Cập nhật tin tuyển dụng thành công",
            data: job,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({
                success: false,
                message: "Dữ liệu không hợp lệ",
                errors: error.errors,
            });
            return;
        }
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Cập nhật thất bại",
        });
    }
});
exports.updateJobAdmin = updateJobAdmin;
// Delete job (Admin)
const deleteJobAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = parseInt(req.params.id);
        const result = yield jobService.deleteJobPostAdmin(jobId);
        res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Xóa thất bại",
        });
    }
});
exports.deleteJobAdmin = deleteJobAdmin;
// Save job
const saveJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Chưa đăng nhập" });
            return;
        }
        const jobPostId = parseInt(req.params.id);
        const savedJob = yield jobService.saveJob(req.user.id, jobPostId);
        res.status(201).json({
            success: true,
            message: "Lưu tin thành công",
            data: savedJob,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Lưu tin thất bại",
        });
    }
});
exports.saveJob = saveJob;
// Unsave job
const unsaveJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Chưa đăng nhập" });
            return;
        }
        const jobPostId = parseInt(req.params.id);
        const result = yield jobService.unsaveJob(req.user.id, jobPostId);
        res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Bỏ lưu thất bại",
        });
    }
});
exports.unsaveJob = unsaveJob;
// Get saved jobs
const getSavedJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Chưa đăng nhập" });
            return;
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = yield jobService.getSavedJobs(req.user.id, page, limit);
        res.status(200).json({
            success: true,
            data: result.savedJobs,
            meta: result.meta,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Lấy danh sách thất bại",
        });
    }
});
exports.getSavedJobs = getSavedJobs;
//# sourceMappingURL=job.controller.js.map