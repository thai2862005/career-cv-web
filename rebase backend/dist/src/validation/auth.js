"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.changePasswordSchema = exports.updateProfileSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email không hợp lệ"),
    password: zod_1.z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    Fullname: zod_1.z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    roleId: zod_1.z.number().optional(),
    role: zod_1.z.enum(["JOB_SEEKER", "HR", "ADMIN"]).optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email không hợp lệ"),
    password: zod_1.z.string().min(1, "Mật khẩu không được để trống"),
});
exports.updateProfileSchema = zod_1.z.object({
    Fullname: zod_1.z.string().min(2).optional(),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    avatar: zod_1.z.string().optional(),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, "Mật khẩu hiện tại không được để trống"),
    newPassword: zod_1.z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email không hợp lệ"),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1),
    password: zod_1.z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});
//# sourceMappingURL=auth.js.map