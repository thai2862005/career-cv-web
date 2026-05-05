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
exports.getAllCompanies = exports.getSystemReports = exports.getAllRoles = exports.resetUserPassword = exports.deleteUser = exports.toggleUserStatus = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.getDashboardStats = void 0;
const adminService = __importStar(require("../service/admin.service"));
const zod_1 = require("zod");
const zod_2 = require("zod");
const updateUserSchema = zod_1.z.object({
    Fullname: zod_1.z.string().min(2).optional(),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    roleId: zod_1.z.number().optional(),
    isActive: zod_1.z.boolean().optional(),
});
const resetPasswordSchema = zod_1.z.object({
    newPassword: zod_1.z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});
// Get dashboard stats
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield adminService.getDashboardStats();
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
exports.getDashboardStats = getDashboardStats;
// Get all users
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const roleId = req.query.roleId ? parseInt(req.query.roleId) : undefined;
        const result = yield adminService.getAllUsers(page, limit, roleId);
        res.status(200).json({
            success: true,
            data: result.users,
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
exports.getAllUsers = getAllUsers;
// Get user by ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.id);
        const user = yield adminService.getUserById(userId);
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : 'Không tìm thấy',
        });
    }
});
exports.getUserById = getUserById;
// Update user
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.id);
        const validatedData = updateUserSchema.parse(req.body);
        const user = yield adminService.updateUser(userId, validatedData);
        res.status(200).json({
            success: true,
            message: 'Cập nhật người dùng thành công',
            data: user,
        });
    }
    catch (error) {
        if (error instanceof zod_2.ZodError) {
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
exports.updateUser = updateUser;
// Toggle user status
const toggleUserStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.id);
        const user = yield adminService.toggleUserStatus(userId);
        res.status(200).json({
            success: true,
            message: user.isActive ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản',
            data: user,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Cập nhật thất bại',
        });
    }
});
exports.toggleUserStatus = toggleUserStatus;
// Delete user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.id);
        const result = yield adminService.deleteUser(userId);
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
exports.deleteUser = deleteUser;
// Reset user password
const resetUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.id);
        const validatedData = resetPasswordSchema.parse(req.body);
        const result = yield adminService.resetUserPassword(userId, validatedData.newPassword);
        res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        if (error instanceof zod_2.ZodError) {
            res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: error.errors,
            });
            return;
        }
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Đặt lại mật khẩu thất bại',
        });
    }
});
exports.resetUserPassword = resetUserPassword;
// Get all roles
const getAllRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield adminService.getAllRoles();
        res.status(200).json({
            success: true,
            data: roles,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Lấy danh sách thất bại',
        });
    }
});
exports.getAllRoles = getAllRoles;
// Get system reports
const getSystemReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
        const reports = yield adminService.getSystemReports(startDate, endDate);
        res.status(200).json({
            success: true,
            data: reports,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Lấy báo cáo thất bại',
        });
    }
});
exports.getSystemReports = getSystemReports;
// Get all companies (Admin)
const getAllCompanies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const result = yield adminService.getAllCompaniesAdmin(page, limit);
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
//# sourceMappingURL=admin.controller.js.map