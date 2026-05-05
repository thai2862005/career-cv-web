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
exports.getCompanyReviews = exports.createReview = exports.getMyCompany = exports.verifyCompany = exports.deleteCompany = exports.updateCompany = exports.getCompanyById = exports.getAllCompanies = exports.createCompany = void 0;
const companyService = __importStar(require("../service/company.service"));
const company_1 = require("../validation/company");
const zod_1 = require("zod");
// Create company
const createCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const validatedData = company_1.createCompanySchema.parse(req.body);
        const company = yield companyService.createCompany(req.user.id, validatedData);
        res.status(201).json({
            success: true,
            message: 'Tạo công ty thành công',
            data: company,
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
            message: error instanceof Error ? error.message : 'Tạo công ty thất bại',
        });
    }
});
exports.createCompany = createCompany;
// Get all companies
const getAllCompanies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = yield companyService.getAllCompanies(page, limit);
        res.status(200).json({
            success: true,
            data: result.companies,
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
exports.getAllCompanies = getAllCompanies;
// Get company by ID
const getCompanyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = parseInt(req.params.id);
        const company = yield companyService.getCompanyById(companyId);
        res.status(200).json({
            success: true,
            data: company,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : 'Không tìm thấy công ty',
        });
    }
});
exports.getCompanyById = getCompanyById;
// Update company
const updateCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const companyId = parseInt(req.params.id);
        const validatedData = company_1.updateCompanySchema.parse(req.body);
        const company = yield companyService.updateCompany(companyId, req.user.id, validatedData);
        res.status(200).json({
            success: true,
            message: 'Cập nhật công ty thành công',
            data: company,
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
exports.updateCompany = updateCompany;
// Delete company (Admin)
const deleteCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = parseInt(req.params.id);
        const result = yield companyService.deleteCompany(companyId);
        res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Xóa thất bại',
        });
    }
});
exports.deleteCompany = deleteCompany;
// Verify company (Admin)
const verifyCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = parseInt(req.params.id);
        const { isVerified } = req.body;
        const company = yield companyService.verifyCompany(companyId, isVerified);
        res.status(200).json({
            success: true,
            message: isVerified ? 'Xác minh công ty thành công' : 'Đã hủy xác minh công ty',
            data: company,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Cập nhật thất bại',
        });
    }
});
exports.verifyCompany = verifyCompany;
// Get my company
const getMyCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const company = yield companyService.getMyCompany(req.user.id);
        res.status(200).json({
            success: true,
            data: company,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Lấy thông tin thất bại',
        });
    }
});
exports.getMyCompany = getMyCompany;
// Create review
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const validatedData = company_1.companyReviewSchema.parse(req.body);
        const review = yield companyService.createReview(req.user.id, validatedData);
        res.status(201).json({
            success: true,
            message: 'Đánh giá thành công',
            data: review,
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
            message: error instanceof Error ? error.message : 'Đánh giá thất bại',
        });
    }
});
exports.createReview = createReview;
// Get company reviews
const getCompanyReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = parseInt(req.params.id);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = yield companyService.getCompanyReviews(companyId, page, limit);
        res.status(200).json({
            success: true,
            data: result.reviews,
            meta: result.meta,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Lấy đánh giá thất bại',
        });
    }
});
exports.getCompanyReviews = getCompanyReviews;
//# sourceMappingURL=company.controller.js.map