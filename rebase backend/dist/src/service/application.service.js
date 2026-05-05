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
exports.searchCandidates = exports.getApplicationStats = exports.getCompanyApplications = exports.updateApplicationStatus = exports.getJobApplications = exports.cancelApplication = exports.getApplicationById = exports.getUserApplications = exports.applyForJob = void 0;
const client_1 = require("../config/client");
// Apply for job
const applyForJob = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobPostId, cvId, coverLetter } = data;
    // Check if job exists and is active
    const job = yield client_1.prisma.jobPost.findFirst({
        where: { id: jobPostId, isActive: true, isApproved: true },
    });
    if (!job) {
        throw new Error('Tin tuyển dụng không tồn tại hoặc đã hết hạn');
    }
    // Check if CV exists and belongs to user
    const cv = yield client_1.prisma.cV.findFirst({
        where: { id: cvId, userId },
    });
    if (!cv) {
        throw new Error('CV không tồn tại');
    }
    // Check if already applied
    const existingApplication = yield client_1.prisma.jobApplication.findFirst({
        where: { userId, jobPostId },
    });
    if (existingApplication) {
        throw new Error('Bạn đã ứng tuyển vị trí này');
    }
    // Create application
    const application = yield client_1.prisma.jobApplication.create({
        data: {
            userId,
            jobPostId,
            cvId,
            coverLetter,
        },
        include: {
            jobPost: {
                include: {
                    company: {
                        select: { id: true, name: true, logoUrl: true },
                    },
                },
            },
            cv: true,
        },
    });
    return application;
});
exports.applyForJob = applyForJob;
// Get user applications
const getUserApplications = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [applications, total] = yield Promise.all([
        client_1.prisma.jobApplication.findMany({
            where: { userId },
            skip,
            take: limit,
            include: {
                jobPost: {
                    include: {
                        company: {
                            select: { id: true, name: true, logoUrl: true, location: true },
                        },
                    },
                },
                cv: true,
            },
            orderBy: { appliedAt: 'desc' },
        }),
        client_1.prisma.jobApplication.count({ where: { userId } }),
    ]);
    return {
        applications,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
exports.getUserApplications = getUserApplications;
// Get application by ID
const getApplicationById = (applicationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield client_1.prisma.jobApplication.findFirst({
        where: { id: applicationId, userId },
        include: {
            jobPost: {
                include: {
                    company: true,
                },
            },
            cv: true,
        },
    });
    if (!application) {
        throw new Error('Không tìm thấy đơn ứng tuyển');
    }
    return application;
});
exports.getApplicationById = getApplicationById;
// Cancel application
const cancelApplication = (applicationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield client_1.prisma.jobApplication.findFirst({
        where: { id: applicationId, userId },
    });
    if (!application) {
        throw new Error('Không tìm thấy đơn ứng tuyển');
    }
    if (application.status !== 'PENDING') {
        throw new Error('Không thể hủy đơn đã được xử lý');
    }
    yield client_1.prisma.jobApplication.delete({
        where: { id: applicationId },
    });
    return { message: 'Hủy đơn ứng tuyển thành công' };
});
exports.cancelApplication = cancelApplication;
// Get job applications (HR)
const getJobApplications = (jobPostId_1, companyId_1, ...args_1) => __awaiter(void 0, [jobPostId_1, companyId_1, ...args_1], void 0, function* (jobPostId, companyId, page = 1, limit = 10, status) {
    const skip = (page - 1) * limit;
    // Verify job belongs to company
    const job = yield client_1.prisma.jobPost.findFirst({
        where: { id: jobPostId, companyId },
    });
    if (!job) {
        throw new Error('Không tìm thấy tin tuyển dụng');
    }
    const where = { jobPostId };
    if (status) {
        where.status = status;
    }
    const [applications, total] = yield Promise.all([
        client_1.prisma.jobApplication.findMany({
            where,
            skip,
            take: limit,
            include: {
                user: {
                    select: { id: true, Fullname: true, email: true, phone: true, avatar: true },
                },
                cv: true,
            },
            orderBy: { appliedAt: 'desc' },
        }),
        client_1.prisma.jobApplication.count({ where }),
    ]);
    return {
        applications,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
exports.getJobApplications = getJobApplications;
// Update application status (HR)
const updateApplicationStatus = (applicationId, companyId, status, note) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify application belongs to company's job
    const application = yield client_1.prisma.jobApplication.findFirst({
        where: {
            id: applicationId,
            jobPost: { companyId },
        },
    });
    if (!application) {
        throw new Error('Không tìm thấy đơn ứng tuyển');
    }
    const updatedApplication = yield client_1.prisma.jobApplication.update({
        where: { id: applicationId },
        data: {
            status,
            note,
            reviewedAt: new Date(),
        },
        include: {
            user: {
                select: { id: true, Fullname: true, email: true },
            },
            jobPost: true,
        },
    });
    return updatedApplication;
});
exports.updateApplicationStatus = updateApplicationStatus;
// Get all applications for company (HR)
const getCompanyApplications = (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, limit = 10, status) {
    const skip = (page - 1) * limit;
    const where = {
        jobPost: { companyId },
    };
    if (status) {
        where.status = status;
    }
    const [applications, total] = yield Promise.all([
        client_1.prisma.jobApplication.findMany({
            where,
            skip,
            take: limit,
            include: {
                user: {
                    select: { id: true, Fullname: true, email: true, phone: true, avatar: true },
                },
                jobPost: {
                    select: { id: true, title: true },
                },
                cv: true,
            },
            orderBy: { appliedAt: 'desc' },
        }),
        client_1.prisma.jobApplication.count({ where }),
    ]);
    return {
        applications,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
exports.getCompanyApplications = getCompanyApplications;
// Get application statistics (HR)
const getApplicationStats = (companyId) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield client_1.prisma.jobApplication.groupBy({
        by: ['status'],
        where: {
            jobPost: { companyId },
        },
        _count: true,
    });
    const total = yield client_1.prisma.jobApplication.count({
        where: {
            jobPost: { companyId },
        },
    });
    return {
        total,
        byStatus: stats.reduce((acc, stat) => {
            acc[stat.status] = stat._count;
            return acc;
        }, {}),
    };
});
exports.getApplicationStats = getApplicationStats;
// Search candidates (HR)
const searchCandidates = (keyword_1, ...args_1) => __awaiter(void 0, [keyword_1, ...args_1], void 0, function* (keyword, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where = {};
    if (keyword) {
        where.OR = [
            { Fullname: { contains: keyword } },
            { email: { contains: keyword } },
        ];
    }
    const [users, total] = yield Promise.all([
        client_1.prisma.user.findMany({
            where: Object.assign(Object.assign({}, where), { role: { name: 'JOB_SEEKER' }, cvs: { some: {} } }),
            skip,
            take: limit,
            select: {
                id: true,
                Fullname: true,
                email: true,
                phone: true,
                avatar: true,
                address: true,
                cvs: {
                    where: { isDefault: true },
                    take: 1,
                },
                _count: {
                    select: { applications: true },
                },
            },
        }),
        client_1.prisma.user.count({
            where: Object.assign(Object.assign({}, where), { role: { name: 'JOB_SEEKER' }, cvs: { some: {} } }),
        }),
    ]);
    return {
        candidates: users,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
exports.searchCandidates = searchCandidates;
//# sourceMappingURL=application.service.js.map