"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyReviewSchema = exports.updateCompanySchema = exports.createCompanySchema = void 0;
const zod_1 = require("zod");
exports.createCompanySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Tên công ty phải có ít nhất 2 ký tự'),
    description: zod_1.z.string().min(20, 'Mô tả phải có ít nhất 20 ký tự'),
    location: zod_1.z.string().min(1, 'Địa điểm không được để trống'),
    website: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    logoUrl: zod_1.z.string().optional(),
    coverImage: zod_1.z.string().optional(),
    size: zod_1.z.string().optional(),
    industry: zod_1.z.string().optional(),
});
exports.updateCompanySchema = exports.createCompanySchema.partial();
exports.companyReviewSchema = zod_1.z.object({
    companyId: zod_1.z.number(),
    rating: zod_1.z.number().min(1).max(5),
    title: zod_1.z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
    content: zod_1.z.string().min(20, 'Nội dung phải có ít nhất 20 ký tự'),
    pros: zod_1.z.string().optional(),
    cons: zod_1.z.string().optional(),
    isAnonymous: zod_1.z.boolean().optional().default(false),
});
//# sourceMappingURL=company.js.map