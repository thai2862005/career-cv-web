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
exports.setDefaultCV = exports.deleteCV = exports.updateCV = exports.getCVById = exports.getMyCVs = exports.uploadCV = void 0;
const cvService = __importStar(require("../service/cv.service"));
const cv_1 = require("../validation/cv");
const zod_1 = require("zod");
// Upload CV
const uploadCV = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        if (!req.file) {
            res.status(400).json({ success: false, message: 'Vui lòng tải lên file CV' });
            return;
        }
        const validatedData = cv_1.createCVSchema.parse(req.body);
        const cv = yield cvService.createCV(req.user.id, validatedData, {
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
        });
        res.status(201).json({
            success: true,
            message: 'Tải lên CV thành công',
            data: cv,
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
            message: error instanceof Error ? error.message : 'Tải lên thất bại',
        });
    }
});
exports.uploadCV = uploadCV;
// Get my CVs
const getMyCVs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const cvs = yield cvService.getUserCVs(req.user.id);
        res.status(200).json({
            success: true,
            data: cvs,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Lấy danh sách CV thất bại',
        });
    }
});
exports.getMyCVs = getMyCVs;
// Get CV by ID
const getCVById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const cvId = parseInt(req.params.id);
        const cv = yield cvService.getCVById(cvId, req.user.id);
        res.status(200).json({
            success: true,
            data: cv,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Lấy CV thất bại',
        });
    }
});
exports.getCVById = getCVById;
// Update CV
const updateCV = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const cvId = parseInt(req.params.id);
        const validatedData = cv_1.updateCVSchema.parse(req.body);
        const cv = yield cvService.updateCV(cvId, req.user.id, validatedData);
        res.status(200).json({
            success: true,
            message: 'Cập nhật CV thành công',
            data: cv,
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
exports.updateCV = updateCV;
// Delete CV
const deleteCV = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const cvId = parseInt(req.params.id);
        const result = yield cvService.deleteCV(cvId, req.user.id);
        res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Xóa CV thất bại',
        });
    }
});
exports.deleteCV = deleteCV;
// Set default CV
const setDefaultCV = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const cvId = parseInt(req.params.id);
        const cv = yield cvService.setDefaultCV(cvId, req.user.id);
        res.status(200).json({
            success: true,
            message: 'Đặt CV mặc định thành công',
            data: cv,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Cập nhật thất bại',
        });
    }
});
exports.setDefaultCV = setDefaultCV;
//# sourceMappingURL=cv.controller.js.map