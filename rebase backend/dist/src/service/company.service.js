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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanyReviews = exports.createReview = exports.getMyCompany = exports.verifyCompany = exports.deleteCompany = exports.updateCompany = exports.getCompanyById = exports.getAllCompanies = exports.createCompany = void 0;
const client_1 = require("../config/client");
// Create company
const createCompany = (hrUserId, data) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if HR already has a company
    const existingCompany = yield client_1.prisma.company.findFirst({
        where: { hrUserId },
    });
    if (existingCompany) {
        throw new Error('Bạn đã có công ty');
    }
    const company = yield client_1.prisma.company.create({
        data: {
            name: data.name,
            description: data.description,
            location: data.location,
            website: data.website || null,
            logoUrl: data.logoUrl || null,
            coverImage: data.coverImage || null,
            size: data.size || null,
            industry: data.industry || null,
            hrUser: {
                connect: { id: hrUserId },
            },
        },
    });
    return company;
});
exports.createCompany = createCompany;
// Get all companies
const getAllCompanies = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [companies, total] = yield Promise.all([
        client_1.prisma.company.findMany({
            skip,
            take: limit,
            include: {
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
exports.getAllCompanies = getAllCompanies;
// Get company by ID
const getCompanyById = (companyId) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield client_1.prisma.company.findUnique({
        where: { id: companyId },
        include: {
            jobs: {
                where: { isActive: true, isApproved: true },
                orderBy: { createdAt: 'desc' },
                take: 10,
            },
            reviews: {
                include: {
                    user: {
                        select: { id: true, Fullname: true, avatar: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: 5,
            },
            _count: {
                select: { jobs: true, reviews: true },
            },
        },
    });
    if (!company) {
        throw new Error('Không tìm thấy công ty');
    }
    // Calculate average rating
    const avgRating = yield client_1.prisma.companyReview.aggregate({
        where: { companyId },
        _avg: { rating: true },
    });
    return Object.assign(Object.assign({}, company), { avgRating: avgRating._avg.rating || 0 });
});
exports.getCompanyById = getCompanyById;
// Update company
const updateCompany = (companyId, hrUserId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield client_1.prisma.company.findFirst({
        where: { id: companyId, hrUserId },
    });
    if (!company) {
        throw new Error('Không tìm thấy công ty hoặc bạn không có quyền');
    }
    const updatedCompany = yield client_1.prisma.company.update({
        where: { id: companyId },
        data,
    });
    return updatedCompany;
});
exports.updateCompany = updateCompany;
// Delete company (Admin only)
const deleteCompany = (companyId) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield client_1.prisma.company.findUnique({
        where: { id: companyId },
    });
    if (!company) {
        throw new Error('Không tìm thấy công ty');
    }
    yield client_1.prisma.company.delete({
        where: { id: companyId },
    });
    return { message: 'Xóa công ty thành công' };
});
exports.deleteCompany = deleteCompany;
// Verify company (Admin only)
const verifyCompany = (companyId, isVerified) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield client_1.prisma.company.update({
        where: { id: companyId },
        data: { isVerified },
    });
    return company;
});
exports.verifyCompany = verifyCompany;
// Get my company (HR)
const getMyCompany = (hrUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield client_1.prisma.company.findFirst({
        where: { hrUserId },
        include: {
            jobs: {
                orderBy: { createdAt: 'desc' },
            },
            _count: {
                select: { jobs: true, reviews: true },
            },
        },
    });
    return company;
});
exports.getMyCompany = getMyCompany;
// Create company review
const createReview = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user already reviewed
    const existingReview = yield client_1.prisma.companyReview.findFirst({
        where: { userId, companyId: data.companyId },
    });
    if (existingReview) {
        throw new Error('Bạn đã đánh giá công ty này');
    }
    const review = yield client_1.prisma.companyReview.create({
        data: {
            rating: data.rating,
            title: data.title,
            content: data.content,
            pros: data.pros || null,
            cons: data.cons || null,
            isAnonymous: data.isAnonymous || false,
            company: {
                connect: { id: data.companyId },
            },
            user: {
                connect: { id: userId },
            },
        },
        include: {
            user: {
                select: { id: true, Fullname: true, avatar: true },
            },
        },
    });
    return review;
});
exports.createReview = createReview;
// Get company reviews
const getCompanyReviews = (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [reviews, total] = yield Promise.all([
        client_1.prisma.companyReview.findMany({
            where: { companyId },
            skip,
            take: limit,
            include: {
                user: {
                    select: { id: true, Fullname: true, avatar: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        }),
        client_1.prisma.companyReview.count({ where: { companyId } }),
    ]);
    return {
        reviews,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
exports.getCompanyReviews = getCompanyReviews;
//# sourceMappingURL=company.service.js.map