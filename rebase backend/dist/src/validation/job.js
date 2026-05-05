"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatusSchema = exports.applyJobSchema = exports.searchJobSchema = exports.updateJobPostSchema = exports.createJobPostSchema = void 0;
const zod_1 = require("zod");
exports.createJobPostSchema = zod_1.z.object({
    title: zod_1.z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
    description: zod_1.z.string().min(50, 'Mô tả phải có ít nhất 50 ký tự'),
    requirements: zod_1.z.string().optional(),
    benefits: zod_1.z.string().optional(),
    location: zod_1.z.string().min(1, 'Địa điểm không được để trống'),
    salary: zod_1.z.number().optional(),
    salaryMax: zod_1.z.number().optional(),
    jobType: zod_1.z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE']).optional(),
    experience: zod_1.z.string().optional(),
    categoryId: zod_1.z.number().optional(),
    deadline: zod_1.z.string().datetime().optional(),
});
exports.updateJobPostSchema = exports.createJobPostSchema.partial();
exports.searchJobSchema = zod_1.z.object({
    keyword: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    categoryId: zod_1.z.number().optional(),
    jobType: zod_1.z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE']).optional(),
    salaryMin: zod_1.z.number().optional(),
    salaryMax: zod_1.z.number().optional(),
    page: zod_1.z.number().default(1),
    limit: zod_1.z.number().default(10),
});
exports.applyJobSchema = zod_1.z.object({
    jobPostId: zod_1.z.number(),
    cvId: zod_1.z.number(),
    coverLetter: zod_1.z.string().optional(),
});
exports.updateApplicationStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['PENDING', 'VIEWED', 'ACCEPTED', 'REJECTED']),
    note: zod_1.z.string().optional(),
});
//# sourceMappingURL=job.js.map