"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadLogo = exports.uploadAvatar = exports.uploadCV = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const auth_1 = require("./auth");
// Ensure directories exist
const ensureDirectoryExists = (dirPath) => {
    if (!fs_1.default.existsSync(dirPath)) {
        fs_1.default.mkdirSync(dirPath, { recursive: true });
    }
};
// CV upload storage
const cvStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, '../../', auth_1.uploadConfig.uploadDir);
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'cv-' + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
// Avatar upload storage
const avatarStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, '../../', auth_1.uploadConfig.avatarDir);
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'avatar-' + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
// Logo upload storage
const logoStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, '../../', auth_1.uploadConfig.logoDir);
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'logo-' + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
// File filter for CV
const cvFileFilter = (req, file, cb) => {
    if (auth_1.uploadConfig.allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Chỉ chấp nhận file PDF hoặc Word'));
    }
};
// File filter for images
const imageFileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)'));
    }
};
// CV upload middleware
exports.uploadCV = (0, multer_1.default)({
    storage: cvStorage,
    limits: {
        fileSize: auth_1.uploadConfig.maxFileSize,
    },
    fileFilter: cvFileFilter,
});
// Avatar upload middleware
exports.uploadAvatar = (0, multer_1.default)({
    storage: avatarStorage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
    },
    fileFilter: imageFileFilter,
});
// Logo upload middleware
exports.uploadLogo = (0, multer_1.default)({
    storage: logoStorage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
    },
    fileFilter: imageFileFilter,
});
//# sourceMappingURL=multer.js.map