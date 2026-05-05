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
exports.changePassword = exports.updateUserProfile = exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const client_1 = require("../config/client");
const auth_1 = require("../config/auth");
// Register new user
const registerUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, Fullname, phone, address, roleId, role } = data;
    let resolvedRoleId = roleId;
    if (!resolvedRoleId && role) {
        const roleByName = yield client_1.prisma.role.findUnique({
            where: { name: role },
            select: { id: true },
        });
        if (!roleByName) {
            throw new Error(`Không tìm thấy role ${role}`);
        }
        resolvedRoleId = roleByName.id;
    }
    if (!resolvedRoleId) {
        const jobSeekerRole = yield client_1.prisma.role.findUnique({
            where: { name: "JOB_SEEKER" },
            select: { id: true },
        });
        if (!jobSeekerRole) {
            throw new Error("Không tìm thấy role mặc định JOB_SEEKER");
        }
        resolvedRoleId = jobSeekerRole.id;
    }
    // Check if email exists
    const existingUser = yield client_1.prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw new Error("Email đã được sử dụng");
    }
    // Hash password
    const hashedPassword = yield bcrypt_1.default.hash(password, auth_1.authConfig.bcryptSaltRounds);
    // Create user
    const user = yield client_1.prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            Fullname,
            phone,
            address,
            roleId: resolvedRoleId,
        },
        include: {
            role: true,
        },
    });
    // Generate token
    const token = generateToken(user);
    return {
        user: {
            id: user.id,
            email: user.email,
            Fullname: user.Fullname,
            phone: user.phone,
            address: user.address,
            avatar: user.avatar,
            role: user.role.name,
        },
        token,
    };
});
exports.registerUser = registerUser;
// Login user
const loginUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = data;
    // Find user
    const user = yield client_1.prisma.user.findUnique({
        where: { email },
        include: {
            role: true,
        },
    });
    if (!user) {
        throw new Error("Email hoặc mật khẩu không đúng");
    }
    if (!user.isActive) {
        throw new Error("Tài khoản đã bị khóa");
    }
    // Verify password
    const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
    if (!isValidPassword) {
        throw new Error("Email hoặc mật khẩu không đúng");
    }
    // Generate token
    const token = generateToken(user);
    return {
        user: {
            id: user.id,
            email: user.email,
            Fullname: user.Fullname,
            phone: user.phone,
            address: user.address,
            avatar: user.avatar,
            role: user.role.name,
            roleId: user.roleId,
        },
        token,
    };
});
exports.loginUser = loginUser;
// Get user profile
const getUserProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.prisma.user.findUnique({
        where: { id: userId },
        include: {
            role: true,
            cvs: true,
            company: true,
        },
    });
    if (!user) {
        throw new Error("Không tìm thấy người dùng");
    }
    const { password } = user, userWithoutPassword = __rest(user, ["password"]);
    return userWithoutPassword;
});
exports.getUserProfile = getUserProfile;
// Update profile
const updateUserProfile = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.prisma.user.update({
        where: { id: userId },
        data,
        include: {
            role: true,
        },
    });
    const { password } = user, userWithoutPassword = __rest(user, ["password"]);
    return userWithoutPassword;
});
exports.updateUserProfile = updateUserProfile;
// Change password
const changePassword = (userId, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new Error("Không tìm thấy người dùng");
    }
    const isValidPassword = yield bcrypt_1.default.compare(currentPassword, user.password);
    if (!isValidPassword) {
        throw new Error("Mật khẩu hiện tại không đúng");
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, auth_1.authConfig.bcryptSaltRounds);
    yield client_1.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });
    return { message: "Đổi mật khẩu thành công" };
});
exports.changePassword = changePassword;
// Generate JWT token
const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        roleId: user.roleId,
        roleName: user.role.name,
    };
    const secret = auth_1.authConfig.jwtSecret;
    const options = {
        expiresIn: auth_1.authConfig.jwtExpiresIn,
    };
    return jwt.sign(payload, secret, options);
};
//# sourceMappingURL=auth.js.map