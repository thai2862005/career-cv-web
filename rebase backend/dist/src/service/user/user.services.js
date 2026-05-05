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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUser = exports.GetUserById = exports.DeleteUser = exports.GetAllUsers = exports.CreateUser = void 0;
const client_1 = require("../../config/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../../config/auth");
// Create user (internal use)
const CreateUser = (name, phone, address, email, password, avatar, roleId) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(password, auth_1.authConfig.bcryptSaltRounds);
    const user = yield client_1.prisma.user.create({
        data: {
            Fullname: name,
            phone,
            address,
            avatar,
            email,
            password: hashedPassword,
            roleId: +roleId,
        },
        include: {
            role: true,
        },
    });
    const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
    return userWithoutPassword;
});
exports.CreateUser = CreateUser;
// Get all users with pagination
const GetAllUsers = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = yield Promise.all([
        client_1.prisma.user.findMany({
            skip,
            take: limit,
            select: {
                id: true,
                email: true,
                Fullname: true,
                phone: true,
                address: true,
                avatar: true,
                isActive: true,
                roleId: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        }),
        client_1.prisma.user.count(),
    ]);
    return {
        users,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
exports.GetAllUsers = GetAllUsers;
// Delete user
const DeleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.prisma.user.findUnique({
        where: { id },
    });
    if (!user) {
        throw new Error('Không tìm thấy người dùng');
    }
    yield client_1.prisma.user.delete({
        where: { id },
    });
    return { message: 'Xóa người dùng thành công' };
});
exports.DeleteUser = DeleteUser;
// Get user by ID
const GetUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.prisma.user.findUnique({
        where: { id },
        include: {
            role: true,
            cvs: true,
            applications: {
                include: {
                    jobPost: {
                        include: {
                            company: { select: { name: true } },
                        },
                    },
                },
                take: 10,
                orderBy: { appliedAt: 'desc' },
            },
        },
    });
    if (!user) {
        throw new Error('Không tìm thấy người dùng');
    }
    const { password } = user, userWithoutPassword = __rest(user, ["password"]);
    return userWithoutPassword;
});
exports.GetUserById = GetUserById;
// Update user
const UpdateUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.prisma.user.update({
        where: { id },
        data,
        include: { role: true },
    });
    const { password } = user, userWithoutPassword = __rest(user, ["password"]);
    return userWithoutPassword;
});
exports.UpdateUser = UpdateUser;
//# sourceMappingURL=user.services.js.map