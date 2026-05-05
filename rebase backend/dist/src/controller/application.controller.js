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
exports.searchCandidates = exports.getApplicationStats = exports.getCompanyApplications = exports.updateApplicationStatus = exports.getJobApplications = exports.cancelApplication = exports.getApplicationById = exports.getMyApplications = exports.applyForJob = void 0;
const applicationService = __importStar(require("../service/application.service"));
const job_1 = require("../validation/job");
const zod_1 = require("zod");
const client_1 = require("../config/client");
// Apply for job
const applyForJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const validatedData = job_1.applyJobSchema.parse(req.body);
        const application = yield applicationService.applyForJob(req.user.id, validatedData);
        res.status(201).json({
            success: true,
            message: 'Ứng tuyển thành công',
            data: application,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: error.errors,
            });
            return;
        }
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Ứng tuyển thất bại',
        });
    }
});
exports.applyForJob = applyForJob;
// Get my applications
const getMyApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = yield applicationService.getUserApplications(req.user.id, page, limit);
        res.status(200).json({
            success: true,
            data: result.applications,
            meta: result.meta,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Lấy danh sách thất bại',
        });
    }
});
exports.getMyApplications = getMyApplications;
// Get application by ID
const getApplicationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const applicationId = parseInt(req.params.id);
        const application = yield applicationService.getApplicationById(applicationId, req.user.id);
        res.status(200).json({
            success: true,
            data: application,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : 'Không tìm thấy',
        });
    }
});
exports.getApplicationById = getApplicationById;
// Cancel application
const cancelApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const applicationId = parseInt(req.params.id);
        const result = yield applicationService.cancelApplication(applicationId, req.user.id);
        res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Hủy đơn thất bại',
        });
    }
});
exports.cancelApplication = cancelApplication;
// Get job applications (HR)
const getJobApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const company = yield client_1.prisma.company.findFirst({
            where: { hrUserId: req.user.id },
        });
        if (!company) {
            res.status(400).json({ success: false, message: 'Bạn chưa có công ty' });
            return;
        }
        const jobPostId = parseInt(req.params.jobId);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const result = yield applicationService.getJobApplications(jobPostId, company.id, page, limit, status);
        res.status(200).json({
            success: true,
            data: result.applications,
            meta: result.meta,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Lấy danh sách thất bại',
        });
    }
});
exports.getJobApplications = getJobApplications;
// Update application status (HR)
const updateApplicationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const company = yield client_1.prisma.company.findFirst({
            where: { hrUserId: req.user.id },
        });
        if (!company) {
            res.status(400).json({ success: false, message: 'Bạn chưa có công ty' });
            return;
        }
        const applicationId = parseInt(req.params.id);
        const validatedData = job_1.updateApplicationStatusSchema.parse(req.body);
        const application = yield applicationService.updateApplicationStatus(applicationId, company.id, validatedData.status, validatedData.note);
        res.status(200).json({
            success: true,
            message: 'Cập nhật trạng thái thành công',
            data: application,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: error.errors,
            });
            return;
        }
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Cập nhật thất bại',
        });
    }
});
exports.updateApplicationStatus = updateApplicationStatus;
// Get all company applications (HR)
const getCompanyApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const company = yield client_1.prisma.company.findFirst({
            where: { hrUserId: req.user.id },
        });
        if (!company) {
            res.status(200).json({
                success: true,
                data: [],
                meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
            });
            return;
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const result = yield applicationService.getCompanyApplications(company.id, page, limit, status);
        res.status(200).json({
            success: true,
            data: result.applications,
            meta: result.meta,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Lấy danh sách thất bại',
        });
    }
});
exports.getCompanyApplications = getCompanyApplications;
// Get application stats (HR)
const getApplicationStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const company = yield client_1.prisma.company.findFirst({
            where: { hrUserId: req.user.id },
        });
        if (!company) {
            res.status(200).json({
                success: true,
                data: { total: 0, byStatus: {} },
            });
            return;
        }
        const stats = yield applicationService.getApplicationStats(company.id);
        res.status(200).json({
            success: true,
            data: stats,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Lấy thống kê thất bại',
        });
    }
});
exports.getApplicationStats = getApplicationStats;
// Search candidates (HR)
const searchCandidates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const keyword = req.query.keyword || '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = yield applicationService.searchCandidates(keyword, page, limit);
        res.status(200).json({
            success: true,
            data: result.candidates,
            meta: result.meta,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Tìm kiếm thất bại',
        });
    }
});
exports.searchCandidates = searchCandidates;
//# sourceMappingURL=application.controller.js.map