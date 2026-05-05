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
exports.getSavedJobs = exports.unsaveJob = exports.saveJob = exports.deleteJobPostAdmin = exports.updateJobPostAdmin = exports.getAllJobsAdmin = exports.getPendingJobs = exports.approveJobPost = exports.getCompanyJobs = exports.toggleJobStatus = exports.deleteJobPost = exports.updateJobPost = exports.getJobPostById = exports.getAllJobPosts = exports.createJobPost = void 0;
const client_1 = require("../config/client");
// Create job post
const createJobPost = (companyId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const jobPost = yield client_1.prisma.jobPost.create({
        data: Object.assign({ title: data.title, description: data.description, requirements: data.requirements || null, benefits: data.benefits || null, location: data.location, salary: data.salary || null, salaryMax: data.salaryMax || null, jobType: data.jobType || "FULL_TIME", experience: data.experience || null, deadline: data.deadline ? new Date(data.deadline) : null, company: {
                connect: { id: companyId },
            } }, (data.categoryId && {
            category: {
                connect: { id: data.categoryId },
            },
        })),
        include: {
            company: true,
            category: true,
        },
    });
    return jobPost;
});
exports.createJobPost = createJobPost;
// Get all job posts (public)
const getAllJobPosts = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword, location, categoryId, jobType, salaryMin, salaryMax, page, limit, } = filters;
    const skip = (page - 1) * limit;
    const where = {
        isActive: true,
        isApproved: true,
    };
    if (keyword) {
        where.OR = [
            { title: { contains: keyword } },
            { description: { contains: keyword } },
            { company: { name: { contains: keyword } } },
        ];
    }
    if (location) {
        where.location = { contains: location };
    }
    if (categoryId) {
        where.categoryId = categoryId;
    }
    if (jobType) {
        where.jobType = jobType;
    }
    if (salaryMin !== undefined) {
        where.salary = { gte: salaryMin };
    }
    if (salaryMax !== undefined) {
        where.salary = Object.assign(Object.assign({}, where.salary), { lte: salaryMax });
    }
    const [jobs, total] = yield Promise.all([
        client_1.prisma.jobPost.findMany({
            where,
            skip,
            take: limit,
            include: {
                company: {
                    select: { id: true, name: true, logoUrl: true, location: true },
                },
                category: true,
                _count: {
                    select: { applies: true, savedBy: true },
                },
            },
            orderBy: { createdAt: "desc" },
        }),
        client_1.prisma.jobPost.count({ where }),
    ]);
    return {
        jobs,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
exports.getAllJobPosts = getAllJobPosts;
// Get job post by ID
const getJobPostById = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield client_1.prisma.jobPost.findUnique({
        where: { id: jobId },
        include: {
            company: true,
            category: true,
            _count: {
                select: { applies: true, savedBy: true },
            },
        },
    });
    if (!job) {
        throw new Error("Không tìm thấy tin tuyển dụng");
    }
    // Increment view count
    yield client_1.prisma.jobPost.update({
        where: { id: jobId },
        data: { viewCount: { increment: 1 } },
    });
    return job;
});
exports.getJobPostById = getJobPostById;
// Update job post
const updateJobPost = (jobId, companyId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield client_1.prisma.jobPost.findFirst({
        where: { id: jobId, companyId },
    });
    if (!job) {
        throw new Error("Không tìm thấy tin tuyển dụng hoặc bạn không có quyền");
    }
    const updatedJob = yield client_1.prisma.jobPost.update({
        where: { id: jobId },
        data: Object.assign(Object.assign({}, data), { deadline: data.deadline ? new Date(data.deadline) : undefined }),
        include: {
            company: true,
            category: true,
        },
    });
    return updatedJob;
});
exports.updateJobPost = updateJobPost;
// Delete job post
const deleteJobPost = (jobId, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield client_1.prisma.jobPost.findFirst({
        where: { id: jobId, companyId },
    });
    if (!job) {
        throw new Error("Không tìm thấy tin tuyển dụng hoặc bạn không có quyền");
    }
    yield client_1.prisma.jobPost.delete({
        where: { id: jobId },
    });
    return { message: "Xóa tin tuyển dụng thành công" };
});
exports.deleteJobPost = deleteJobPost;
// Toggle job active status
const toggleJobStatus = (jobId, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield client_1.prisma.jobPost.findFirst({
        where: { id: jobId, companyId },
    });
    if (!job) {
        throw new Error("Không tìm thấy tin tuyển dụng");
    }
    const updatedJob = yield client_1.prisma.jobPost.update({
        where: { id: jobId },
        data: { isActive: !job.isActive },
    });
    return updatedJob;
});
exports.toggleJobStatus = toggleJobStatus;
// Get company jobs (HR)
const getCompanyJobs = (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [jobs, total] = yield Promise.all([
        client_1.prisma.jobPost.findMany({
            where: { companyId },
            skip,
            take: limit,
            include: {
                category: true,
                _count: {
                    select: { applies: true },
                },
            },
            orderBy: { createdAt: "desc" },
        }),
        client_1.prisma.jobPost.count({ where: { companyId } }),
    ]);
    return {
        jobs,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
exports.getCompanyJobs = getCompanyJobs;
// Approve job post (Admin)
const approveJobPost = (jobId, isApproved) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield client_1.prisma.jobPost.update({
        where: { id: jobId },
        data: { isApproved },
        include: {
            company: true,
        },
    });
    return job;
});
exports.approveJobPost = approveJobPost;
// Get pending jobs (Admin)
const getPendingJobs = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [jobs, total] = yield Promise.all([
        client_1.prisma.jobPost.findMany({
            where: { isApproved: false },
            skip,
            take: limit,
            include: {
                company: true,
                category: true,
            },
            orderBy: { createdAt: "desc" },
        }),
        client_1.prisma.jobPost.count({ where: { isApproved: false } }),
    ]);
    return {
        jobs,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
exports.getPendingJobs = getPendingJobs;
// Get all jobs (Admin)
const getAllJobsAdmin = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [jobs, total] = yield Promise.all([
        client_1.prisma.jobPost.findMany({
            skip,
            take: limit,
            include: {
                company: true,
                category: true,
            },
            orderBy: { createdAt: "desc" },
        }),
        client_1.prisma.jobPost.count(),
    ]);
    return {
        jobs,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
exports.getAllJobsAdmin = getAllJobsAdmin;
// Update job post (Admin)
const updateJobPostAdmin = (jobId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield client_1.prisma.jobPost.update({
        where: { id: jobId },
        data,
        include: {
            company: true,
            category: true,
        },
    });
    return job;
});
exports.updateJobPostAdmin = updateJobPostAdmin;
// Delete job post (Admin)
const deleteJobPostAdmin = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    yield client_1.prisma.jobPost.delete({
        where: { id: jobId },
    });
    return { message: "Xóa tin tuyển dụng thành công" };
});
exports.deleteJobPostAdmin = deleteJobPostAdmin;
// Save job
const saveJob = (userId, jobPostId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingSave = yield client_1.prisma.savedJob.findUnique({
        where: {
            userId_jobPostId: { userId, jobPostId },
        },
    });
    if (existingSave) {
        throw new Error("Đã lưu tin này");
    }
    const savedJob = yield client_1.prisma.savedJob.create({
        data: { userId, jobPostId },
        include: {
            jobPost: {
                include: {
                    company: {
                        select: { id: true, name: true, logoUrl: true },
                    },
                },
            },
        },
    });
    return savedJob;
});
exports.saveJob = saveJob;
// Unsave job
const unsaveJob = (userId, jobPostId) => __awaiter(void 0, void 0, void 0, function* () {
    const savedJob = yield client_1.prisma.savedJob.findUnique({
        where: {
            userId_jobPostId: { userId, jobPostId },
        },
    });
    if (!savedJob) {
        throw new Error("Chưa lưu tin này");
    }
    yield client_1.prisma.savedJob.delete({
        where: {
            userId_jobPostId: { userId, jobPostId },
        },
    });
    return { message: "Bỏ lưu thành công" };
});
exports.unsaveJob = unsaveJob;
// Get saved jobs
const getSavedJobs = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [savedJobs, total] = yield Promise.all([
        client_1.prisma.savedJob.findMany({
            where: { userId },
            skip,
            take: limit,
            include: {
                jobPost: {
                    include: {
                        company: {
                            select: { id: true, name: true, logoUrl: true, location: true },
                        },
                        category: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        }),
        client_1.prisma.savedJob.count({ where: { userId } }),
    ]);
    return {
        savedJobs,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
exports.getSavedJobs = getSavedJobs;
//# sourceMappingURL=job.service.js.map