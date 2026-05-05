"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLES = exports.uploadConfig = exports.emailConfig = exports.authConfig = void 0;
require("dotenv/config");
exports.authConfig = {
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    bcryptSaltRounds: 10,
};
exports.emailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
    },
    from: process.env.SMTP_FROM || 'noreply@career-cv.com',
};
exports.uploadConfig = {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    uploadDir: 'uploads/cv',
    avatarDir: 'uploads/avatar',
    logoDir: 'uploads/logo',
};
// Role IDs
exports.ROLES = {
    JOB_SEEKER: 1,
    HR: 2,
    ADMIN: 3,
};
//# sourceMappingURL=auth.js.map