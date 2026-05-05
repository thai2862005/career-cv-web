"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Tên danh mục phải có ít nhất 2 ký tự'),
    description: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional().default(true),
});
exports.updateCategorySchema = exports.createCategorySchema.partial();
//# sourceMappingURL=category.js.map