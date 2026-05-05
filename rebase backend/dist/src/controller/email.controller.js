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
exports.resolveContact = exports.getAllContacts = exports.submitContact = exports.getEmailHistory = exports.sendInvitation = void 0;
const emailService = __importStar(require("../service/email.service"));
const zod_1 = require("zod");
const zod_2 = require("zod");
const contactSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    email: zod_1.z.string().email('Email không hợp lệ'),
    subject: zod_1.z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
    message: zod_1.z.string().min(10, 'Nội dung phải có ít nhất 10 ký tự'),
});
const invitationSchema = zod_1.z.object({
    toEmail: zod_1.z.string().email('Email không hợp lệ'),
    candidateName: zod_1.z.string().min(2),
    jobTitle: zod_1.z.string().min(2),
    companyName: zod_1.z.string().min(2),
    message: zod_1.z.string().min(10),
});
// Send invitation email (HR)
const sendInvitation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const validatedData = invitationSchema.parse(req.body);
        yield emailService.sendInvitationEmail(validatedData.toEmail, validatedData.candidateName, validatedData.jobTitle, validatedData.companyName, validatedData.message, req.user.id);
        res.status(200).json({
            success: true,
            message: 'Gửi thư mời thành công',
        });
    }
    catch (error) {
        if (error instanceof zod_2.ZodError) {
            res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: error.errors,
            });
            return;
        }
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Gửi email thất bại',
        });
    }
});
exports.sendInvitation = sendInvitation;
// Get email history
const getEmailHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const result = yield emailService.getEmailHistory(req.user.id, page, limit);
        res.status(200).json({
            success: true,
            data: result.emails,
            meta: result.meta,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Lấy lịch sử email thất bại',
        });
    }
});
exports.getEmailHistory = getEmailHistory;
// Submit contact form
const submitContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = contactSchema.parse(req.body);
        const contact = yield emailService.submitContactUs({
            name: validatedData.name,
            email: validatedData.email,
            subject: validatedData.subject,
            message: validatedData.message,
        });
        res.status(201).json({
            success: true,
            message: 'Gửi liên hệ thành công',
            data: contact,
        });
    }
    catch (error) {
        if (error instanceof zod_2.ZodError) {
            res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: error.errors,
            });
            return;
        }
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Gửi liên hệ thất bại',
        });
    }
});
exports.submitContact = submitContact;
// Get all contacts (Admin)
const getAllContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const result = yield emailService.getAllContacts(page, limit);
        res.status(200).json({
            success: true,
            data: result.contacts,
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
exports.getAllContacts = getAllContacts;
// Resolve contact (Admin)
const resolveContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactId = parseInt(req.params.id);
        const contact = yield emailService.resolveContact(contactId);
        res.status(200).json({
            success: true,
            message: 'Đã xử lý liên hệ',
            data: contact,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Cập nhật thất bại',
        });
    }
});
exports.resolveContact = resolveContact;
//# sourceMappingURL=email.controller.js.map