"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCompaniesAdmin = exports.getSystemReports = exports.getAllRoles = exports.resetUserPassword = exports.deleteUser = exports.toggleUserStatus = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.getDashboardStats = void 0;
const client_1 = require("../config/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../config/auth");
// Get dashboard statistics
const getDashboardStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const [totalUsers, totalCompanies, totalJobs, totalApplications, pendingJobs, usersByRole, applicationsByStatus, recentJobs, recentApplications,] = yield Promise.all([
        client_1.prisma.user.count(),
        client_1.prisma.company.count(),
        client_1.prisma.jobPost.count(),
        client_1.prisma.jobApplication.count(),
        client_1.prisma.jobPost.count({ where: { isApproved: false } }),
        client_1.prisma.user.groupBy({
            by: ['roleId'],
            _count: true,
        }),
        client_1.prisma.jobApplication.groupBy({
            by: ['status'],
            _count: true,
        }),
        client_1.prisma.jobPost.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                company: { select: { name: true } },
            },
        }),
        client_1.prisma.jobApplication.findMany({
            take: 5,
            orderBy: { appliedAt: 'desc' },
            include: {
                user: { select: { Fullname: true } },
                jobPost: { select: { title: true } },
            },
        }),
    ]);
    return {
        overview: {
            totalUsers,
            totalCompanies,
            totalJobs,
            totalApplications,
            pendingJobs,
        },
        usersByRole,
        applicationsByStatus,
        recentJobs,
        recentApplications,
    };
});
exports.getDashboardStats = getDashboardStats;
// Get all users (Admin)
const getAllUsers = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 20, roleId) {
    const skip = (page - 1) * limit;
    const where = {};
    if (roleId) {
        where.roleId = roleId;
    }
    const [users, total] = yield Promise.all([
        client_1.prisma.user.findMany({
            where,
            skip,
            take: limit,
            select: {
                id: true,
                email: true,
                Fullname: true,
                phone: true,
                address: true,
                avatar: true,
                isActive: true,
                emailVerified: true,
                roleId: true,
                role: true,
                createdAt: true,
                _count: {
                    select: { applications: true, cvs: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        }),
        client_1.prisma.user.count({ where }),
    ]);
    return {
        users,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
exports.getAllUsers = getAllUsers;
// Get user by ID (Admin)
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.prisma.user.findUnique({
        where: { id: userId },
        include: {
            role: true,
            cvs: true,
            applications: {
                include: {
                    jobPost: {
                        include: {
                            company: { select: { name: true } },
                        },
                    },
                },
                orderBy: { appliedAt: 'desc' },
                take: 10,
            },
            company: true,
        },
    });
    if (!user) {
        throw new Error('Không tìm thấy người dùng');
    }
    const { password } = user, userWithoutPassword = __rest(user, ["password"]);
    return userWithoutPassword;
});
exports.getUserById = getUserById;
// Update user (Admin)
const updateUser = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.prisma.user.update({
        where: { id: userId },
        data,
        include: {
            role: true,
        },
    });
    const { password } = user, userWithoutPassword = __rest(user, ["password"]);
    return userWithoutPassword;
});
exports.updateUser = updateUser;
// Toggle user status (Admin)
const toggleUserStatus = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new Error('Không tìm thấy người dùng');
    }
    const updatedUser = yield client_1.prisma.user.update({
        where: { id: userId },
        data: { isActive: !user.isActive },
        include: { role: true },
    });
    return updatedUser;
});
exports.toggleUserStatus = toggleUserStatus;
// Delete user (Admin)
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new Error('Không tìm thấy người dùng');
    }
    // Check if user is admin
    if (user.roleId === 3) {
        throw new Error('Không thể xóa tài khoản admin');
    }
    yield client_1.prisma.user.delete({
        where: { id: userId },
    });
    return { message: 'Xóa người dùng thành công' };
});
exports.deleteUser = deleteUser;
// Reset user password (Admin)
const resetUserPassword = (userId, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, auth_1.authConfig.bcryptSaltRounds);
    yield client_1.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });
    return { message: 'Đặt lại mật khẩu thành công' };
});
exports.resetUserPassword = resetUserPassword;
// Get all roles
const getAllRoles = () => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield client_1.prisma.role.findMany({
        include: {
            _count: {
                select: { users: true },
            },
        },
    });
    return roles;
});
exports.getAllRoles = getAllRoles;
// Get system reports
const getSystemReports = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    const dateFilter = {};
    if (startDate) {
        dateFilter.gte = startDate;
    }
    if (endDate) {
        dateFilter.lte = endDate;
    }
    const [newUsers, newJobs, newApplications, jobsByCategory, topCompanies,] = yield Promise.all([
        client_1.prisma.user.count({
            where: dateFilter.gte || dateFilter.lte ? { createdAt: dateFilter } : {},
        }),
        client_1.prisma.jobPost.count({
            where: dateFilter.gte || dateFilter.lte ? { createdAt: dateFilter } : {},
        }),
        client_1.prisma.jobApplication.count({
            where: dateFilter.gte || dateFilter.lte ? { appliedAt: dateFilter } : {},
        }),
        client_1.prisma.jobPost.groupBy({
            by: ['categoryId'],
            _count: true,
            orderBy: { _count: { categoryId: 'desc' } },
            take: 10,
        }),
        client_1.prisma.company.findMany({
            take: 10,
            include: {
                _count: {
                    select: { jobs: true },
                },
            },
            orderBy: {
                jobs: {
                    _count: 'desc',
                },
            },
        }),
    ]);
    return {
        newUsers,
        newJobs,
        newApplications,
        jobsByCategory,
        topCompanies,
    };
});
exports.getSystemReports = getSystemReports;
// Get all companies (Admin)
const getAllCompaniesAdmin = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [companies, total] = yield Promise.all([
        client_1.prisma.company.findMany({
            skip,
            take: limit,
            include: {
                hrUser: {
                    select: { id: true, email: true, Fullname: true },
                },
                _count: {
                    select: { jobs: true, reviews: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        }),
        client_1.prisma.company.count(),
    ]);
    return {
        companies,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
exports.getAllCompaniesAdmin = getAllCompaniesAdmin;
//# sourceMappingURL=admin.service.js.map