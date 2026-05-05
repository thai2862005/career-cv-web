"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHROrAdmin = exports.isAdmin = exports.isHR = exports.isJobSeeker = exports.authorizeByRoleName = exports.authorize = exports.optionalAuth = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../config/auth");
// Verify JWT Token
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res
                .status(401)
                .json({ success: false, message: "Không có token xác thực" });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, auth_1.authConfig.jwtSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        res
            .status(401)
            .json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};
exports.authenticate = authenticate;
// Optional authentication - doesn't fail if no token
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, auth_1.authConfig.jwtSecret);
            req.user = decoded;
        }
        next();
    }
    catch (_a) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
// Role-based authorization
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Chưa đăng nhập" });
            return;
        }
        if (!allowedRoles.includes(req.user.roleId)) {
            res
                .status(403)
                .json({ success: false, message: "Không có quyền truy cập" });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
// Role-based authorization by role name to avoid dependency on DB role ID order
const authorizeByRoleName = (...allowedRoleNames) => {
    const normalizedAllowed = allowedRoleNames.map((role) => role.toUpperCase());
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Chưa đăng nhập" });
            return;
        }
        const currentRoleName = String(req.user.roleName || "").toUpperCase();
        if (!normalizedAllowed.includes(currentRoleName)) {
            res
                .status(403)
                .json({ success: false, message: "Không có quyền truy cập" });
            return;
        }
        next();
    };
};
exports.authorizeByRoleName = authorizeByRoleName;
// Shorthand middleware
exports.isJobSeeker = (0, exports.authorizeByRoleName)("JOB_SEEKER", "ADMIN");
exports.isHR = (0, exports.authorizeByRoleName)("HR", "ADMIN");
exports.isAdmin = (0, exports.authorizeByRoleName)("ADMIN");
exports.isHROrAdmin = (0, exports.authorizeByRoleName)("HR", "ADMIN");
//# sourceMappingURL=auth.js.map