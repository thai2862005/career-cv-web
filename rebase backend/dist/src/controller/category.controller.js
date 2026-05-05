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
exports.toggleCategoryStatus = exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getAllCategories = exports.createCategory = void 0;
const categoryService = __importStar(require("../service/category.service"));
const category_1 = require("../validation/category");
const zod_1 = require("zod");
// Create category (Admin)
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = category_1.createCategorySchema.parse(req.body);
        const category = yield categoryService.createCategory(validatedData);
        res.status(201).json({
            success: true,
            message: 'Tạo danh mục thành công',
            data: category,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: error.errors,
            });
            return;
        }
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Tạo danh mục thất bại',
        });
    }
});
exports.createCategory = createCategory;
// Get all categories
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const includeInactive = req.query.includeInactive === 'true';
        const categories = yield categoryService.getAllCategories(includeInactive);
        res.status(200).json({
            success: true,
            data: categories,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Lấy danh sách thất bại',
        });
    }
});
exports.getAllCategories = getAllCategories;
// Get category by ID
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = parseInt(req.params.id);
        const category = yield categoryService.getCategoryById(categoryId);
        res.status(200).json({
            success: true,
            data: category,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : 'Không tìm thấy',
        });
    }
});
exports.getCategoryById = getCategoryById;
// Update category (Admin)
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = parseInt(req.params.id);
        const validatedData = category_1.updateCategorySchema.parse(req.body);
        const category = yield categoryService.updateCategory(categoryId, validatedData);
        res.status(200).json({
            success: true,
            message: 'Cập nhật danh mục thành công',
            data: category,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
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
exports.updateCategory = updateCategory;
// Delete category (Admin)
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = parseInt(req.params.id);
        const result = yield categoryService.deleteCategory(categoryId);
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
exports.deleteCategory = deleteCategory;
// Toggle category status (Admin)
const toggleCategoryStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = parseInt(req.params.id);
        const category = yield categoryService.toggleCategoryStatus(categoryId);
        res.status(200).json({
            success: true,
            message: category.isActive ? 'Đã bật danh mục' : 'Đã tắt danh mục',
            data: category,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Cập nhật thất bại',
        });
    }
});
exports.toggleCategoryStatus = toggleCategoryStatus;
//# sourceMappingURL=category.controller.js.map