"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCVSchema = exports.createCVSchema = void 0;
const zod_1 = require("zod");
exports.createCVSchema = zod_1.z.object({
    title: zod_1.z.string().min(2, 'Tiêu đề CV phải có ít nhất 2 ký tự'),
    isDefault: zod_1.z.boolean().optional().default(false),
});
exports.updateCVSchema = zod_1.z.object({
    title: zod_1.z.string().min(2).optional(),
    isDefault: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=cv.js.map