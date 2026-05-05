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
exports.notifyUserOnStatusChange = exports.notifyHROnApplication = exports.getUserMessages = exports.createMessage = exports.deleteNotification = exports.markAllAsRead = exports.markAsRead = exports.getUserNotifications = exports.createNotification = void 0;
const client_1 = require("../config/client");
// Create notification
const createNotification = (userId, title, content, type, link) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield client_1.prisma.notification.create({
        data: {
            userId,
            title,
            content,
            type,
            link,
        },
    });
    return notification;
});
exports.createNotification = createNotification;
// Get user notifications
const getUserNotifications = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [notifications, total, unreadCount] = yield Promise.all([
        client_1.prisma.notification.findMany({
            where: { userId },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        }),
        client_1.prisma.notification.count({ where: { userId } }),
        client_1.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);
    return {
        notifications,
        unreadCount,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
exports.getUserNotifications = getUserNotifications;
// Mark notification as read
const markAsRead = (notificationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield client_1.prisma.notification.findFirst({
        where: { id: notificationId, userId },
    });
    if (!notification) {
        throw new Error('Không tìm thấy thông báo');
    }
    const updated = yield client_1.prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
    });
    return updated;
});
exports.markAsRead = markAsRead;
// Mark all as read
const markAllAsRead = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield client_1.prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
    });
    return { message: 'Đã đánh dấu tất cả đã đọc' };
});
exports.markAllAsRead = markAllAsRead;
// Delete notification
const deleteNotification = (notificationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield client_1.prisma.notification.findFirst({
        where: { id: notificationId, userId },
    });
    if (!notification) {
        throw new Error('Không tìm thấy thông báo');
    }
    yield client_1.prisma.notification.delete({
        where: { id: notificationId },
    });
    return { message: 'Xóa thông báo thành công' };
});
exports.deleteNotification = deleteNotification;
// Create message
const createMessage = (userId, content) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield client_1.prisma.message.create({
        data: {
            userId,
            content,
        },
    });
    return message;
});
exports.createMessage = createMessage;
// Get user messages
const getUserMessages = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [messages, total] = yield Promise.all([
        client_1.prisma.message.findMany({
            where: { userId },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        }),
        client_1.prisma.message.count({ where: { userId } }),
    ]);
    return {
        messages,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
exports.getUserMessages = getUserMessages;
// Send notification to HR when user applies
const notifyHROnApplication = (applicationId) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield client_1.prisma.jobApplication.findUnique({
        where: { id: applicationId },
        include: {
            user: { select: { Fullname: true } },
            jobPost: {
                include: {
                    company: { select: { hrUserId: true } },
                },
            },
        },
    });
    if (application && application.jobPost.company.hrUserId) {
        yield (0, exports.createNotification)(application.jobPost.company.hrUserId, 'Đơn ứng tuyển mới', `${application.user.Fullname} đã ứng tuyển vào vị trí ${application.jobPost.title}`, 'APPLICATION_STATUS', `/hr/applications/${applicationId}`);
    }
});
exports.notifyHROnApplication = notifyHROnApplication;
// Send notification to user on status change
const notifyUserOnStatusChange = (applicationId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield client_1.prisma.jobApplication.findUnique({
        where: { id: applicationId },
        include: {
            jobPost: {
                include: {
                    company: { select: { name: true } },
                },
            },
        },
    });
    if (application) {
        let message = '';
        switch (status) {
            case 'VIEWED':
                message = `Đơn ứng tuyển vị trí ${application.jobPost.title} tại ${application.jobPost.company.name} đã được xem`;
                break;
            case 'ACCEPTED':
                message = `Chúc mừng! Đơn ứng tuyển vị trí ${application.jobPost.title} tại ${application.jobPost.company.name} đã được chấp nhận`;
                break;
            case 'REJECTED':
                message = `Rất tiếc, đơn ứng tuyển vị trí ${application.jobPost.title} tại ${application.jobPost.company.name} không được chấp nhận`;
                break;
        }
        yield (0, exports.createNotification)(application.userId, 'Cập nhật đơn ứng tuyển', message, 'APPLICATION_STATUS', `/applications/${applicationId}`);
    }
});
exports.notifyUserOnStatusChange = notifyUserOnStatusChange;
//# sourceMappingURL=notification.service.js.map