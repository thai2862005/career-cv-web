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
exports.createMessage = exports.getMyMessages = exports.deleteNotification = exports.markAllAsRead = exports.markAsRead = exports.getMyNotifications = void 0;
const notificationService = __importStar(require("../service/notification.service"));
// Get my notifications
const getMyNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const result = yield notificationService.getUserNotifications(req.user.id, page, limit);
        res.status(200).json({
            success: true,
            data: result.notifications,
            unreadCount: result.unreadCount,
            meta: result.meta,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Lấy thông báo thất bại',
        });
    }
});
exports.getMyNotifications = getMyNotifications;
// Mark as read
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const notificationId = parseInt(req.params.id);
        const notification = yield notificationService.markAsRead(notificationId, req.user.id);
        res.status(200).json({
            success: true,
            data: notification,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Cập nhật thất bại',
        });
    }
});
exports.markAsRead = markAsRead;
// Mark all as read
const markAllAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const result = yield notificationService.markAllAsRead(req.user.id);
        res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Cập nhật thất bại',
        });
    }
});
exports.markAllAsRead = markAllAsRead;
// Delete notification
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const notificationId = parseInt(req.params.id);
        const result = yield notificationService.deleteNotification(notificationId, req.user.id);
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
exports.deleteNotification = deleteNotification;
// Get my messages
const getMyMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const result = yield notificationService.getUserMessages(req.user.id, page, limit);
        res.status(200).json({
            success: true,
            data: result.messages,
            meta: result.meta,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Lấy tin nhắn thất bại',
        });
    }
});
exports.getMyMessages = getMyMessages;
// Create message
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
            return;
        }
        const { content } = req.body;
        if (!content || content.trim() === '') {
            res.status(400).json({ success: false, message: 'Nội dung không được để trống' });
            return;
        }
        const message = yield notificationService.createMessage(req.user.id, content);
        res.status(201).json({
            success: true,
            message: 'Gửi tin nhắn thành công',
            data: message,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Gửi tin nhắn thất bại',
        });
    }
});
exports.createMessage = createMessage;
//# sourceMappingURL=notification.controller.js.map