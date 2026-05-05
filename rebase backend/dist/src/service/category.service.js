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
exports.toggleCategoryStatus = exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getAllCategories = exports.createCategory = void 0;
const client_1 = require("../config/client");
// Create category (Admin)
const createCategory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const existingCategory = yield client_1.prisma.category.findUnique({
        where: { name: data.name },
    });
    if (existingCategory) {
        throw new Error('Danh mục đã tồn tại');
    }
    const category = yield client_1.prisma.category.create({
        data: {
            name: data.name,
            description: data.description || null,
            icon: data.icon || null,
            isActive: (_a = data.isActive) !== null && _a !== void 0 ? _a : true,
        },
    });
    return category;
});
exports.createCategory = createCategory;
// Get all categories
const getAllCategories = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (includeInactive = false) {
    const where = includeInactive ? {} : { isActive: true };
    const categories = yield client_1.prisma.category.findMany({
        where,
        include: {
            _count: {
                select: { jobs: true },
            },
        },
        orderBy: { name: 'asc' },
    });
    return categories;
});
exports.getAllCategories = getAllCategories;
// Get category by ID
const getCategoryById = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield client_1.prisma.category.findUnique({
        where: { id: categoryId },
        include: {
            jobs: {
                where: { isActive: true, isApproved: true },
                take: 10,
                include: {
                    company: {
                        select: { id: true, name: true, logoUrl: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            },
            _count: {
                select: { jobs: true },
            },
        },
    });
    if (!category) {
        throw new Error('Không tìm thấy danh mục');
    }
    return category;
});
exports.getCategoryById = getCategoryById;
// Update category (Admin)
const updateCategory = (categoryId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield client_1.prisma.category.findUnique({
        where: { id: categoryId },
    });
    if (!category) {
        throw new Error('Không tìm thấy danh mục');
    }
    if (data.name && data.name !== category.name) {
        const existingCategory = yield client_1.prisma.category.findUnique({
            where: { name: data.name },
        });
        if (existingCategory) {
            throw new Error('Tên danh mục đã tồn tại');
        }
    }
    const updatedCategory = yield client_1.prisma.category.update({
        where: { id: categoryId },
        data,
    });
    return updatedCategory;
});
exports.updateCategory = updateCategory;
// Delete category (Admin)
const deleteCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield client_1.prisma.category.findUnique({
        where: { id: categoryId },
        include: {
            _count: {
                select: { jobs: true },
            },
        },
    });
    if (!category) {
        throw new Error('Không tìm thấy danh mục');
    }
    if (category._count.jobs > 0) {
        throw new Error('Không thể xóa danh mục đang có tin tuyển dụng');
    }
    yield client_1.prisma.category.delete({
        where: { id: categoryId },
    });
    return { message: 'Xóa danh mục thành công' };
});
exports.deleteCategory = deleteCategory;
// Toggle category status (Admin)
const toggleCategoryStatus = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield client_1.prisma.category.findUnique({
        where: { id: categoryId },
    });
    if (!category) {
        throw new Error('Không tìm thấy danh mục');
    }
    const updatedCategory = yield client_1.prisma.category.update({
        where: { id: categoryId },
        data: { isActive: !category.isActive },
    });
    return updatedCategory;
});
exports.toggleCategoryStatus = toggleCategoryStatus;
//# sourceMappingURL=category.service.js.map