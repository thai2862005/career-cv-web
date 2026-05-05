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
exports.UpdateUserApi = exports.GetUserByIdApi = exports.DeleteUserApi = exports.GetAllUsersApi = exports.CreateUSerApi = void 0;
const user_services_1 = require("../../service/user/user.services");
const zod_1 = require("zod");
const createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    avatar: zod_1.z.string().optional(),
    roleId: zod_1.z.string().optional().default('1'),
});
const updateUserSchema = zod_1.z.object({
    Fullname: zod_1.z.string().min(2).optional(),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    avatar: zod_1.z.string().optional(),
});
// Create user
const CreateUSerApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phone, address, email, password, avatar, roleId } = createUserSchema.parse(req.body);
        const user = yield (0, user_services_1.CreateUser)(name, phone || '', address || '', email, password, avatar || '', roleId);
        res.status(201).json({
            success: true,
            message: 'Tạo người dùng thành công',
            data: user,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Tạo người dùng thất bại',
        });
    }
});
exports.CreateUSerApi = CreateUSerApi;
// Get all users
const GetAllUsersApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const result = yield (0, user_services_1.GetAllUsers)(page, limit);
        res.status(200).json({
            success: true,
            data: result.users,
            meta: result.meta,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Lấy danh sách thất bại',
        });
    }
});
exports.GetAllUsersApi = GetAllUsersApi;
// Delete user
const DeleteUserApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield (0, user_services_1.DeleteUser)(+id);
        res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Xóa người dùng thất bại',
        });
    }
});
exports.DeleteUserApi = DeleteUserApi;
// Get user by ID
const GetUserByIdApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield (0, user_services_1.GetUserById)(+id);
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : 'Không tìm thấy người dùng',
        });
    }
});
exports.GetUserByIdApi = GetUserByIdApi;
// Update user
const UpdateUserApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = updateUserSchema.parse(req.body);
        const user = yield (0, user_services_1.UpdateUser)(+id, data);
        res.status(200).json({
            success: true,
            message: 'Cập nhật thành công',
            data: user,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Cập nhật thất bại',
        });
    }
});
exports.UpdateUserApi = UpdateUserApi;
//# sourceMappingURL=user.controller.js.map