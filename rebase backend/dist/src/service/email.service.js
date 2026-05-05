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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveContact = exports.getAllContacts = exports.submitContactUs = exports.getEmailHistory = exports.sendInvitationEmail = exports.sendStatusUpdateEmail = exports.sendApplicationEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const client_1 = require("../config/client");
const auth_1 = require("../config/auth");
// Create transporter
const transporter = nodemailer_1.default.createTransport({
    host: auth_1.emailConfig.host,
    port: auth_1.emailConfig.port,
    secure: auth_1.emailConfig.secure,
    auth: {
        user: auth_1.emailConfig.auth.user,
        pass: auth_1.emailConfig.auth.pass,
    },
});
// Send email
const sendEmail = (to, subject, content, type, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Create email record
    const email = yield client_1.prisma.email.create({
        data: {
            to,
            subject,
            content,
            type,
            userId,
            status: 'PENDING',
        },
    });
    try {
        // Send email
        yield transporter.sendMail({
            from: auth_1.emailConfig.from,
            to,
            subject,
            html: content,
        });
        // Update status
        yield client_1.prisma.email.update({
            where: { id: email.id },
            data: {
                status: 'SENT',
                sentAt: new Date(),
            },
        });
        return { success: true, message: 'Email đã được gửi' };
    }
    catch (error) {
        // Update status with error
        yield client_1.prisma.email.update({
            where: { id: email.id },
            data: {
                status: 'FAILED',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
        });
        throw new Error('Gửi email thất bại');
    }
});
exports.sendEmail = sendEmail;
// Send application confirmation email
const sendApplicationEmail = (applicationId) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield client_1.prisma.jobApplication.findUnique({
        where: { id: applicationId },
        include: {
            user: { select: { email: true, Fullname: true } },
            jobPost: {
                include: {
                    company: { select: { name: true } },
                },
            },
        },
    });
    if (!application)
        return;
    const subject = `Xác nhận ứng tuyển - ${application.jobPost.title}`;
    const content = `
    <h2>Xin chào ${application.user.Fullname},</h2>
    <p>Chúng tôi đã nhận được đơn ứng tuyển của bạn cho vị trí <strong>${application.jobPost.title}</strong> tại <strong>${application.jobPost.company.name}</strong>.</p>
    <p>Chúng tôi sẽ xem xét hồ sơ của bạn và liên hệ sớm nhất có thể.</p>
    <p>Trân trọng,<br/>Career CV Team</p>
  `;
    yield (0, exports.sendEmail)(application.user.email, subject, content, 'APPLY_JOB', application.userId);
});
exports.sendApplicationEmail = sendApplicationEmail;
// Send status update email
const sendStatusUpdateEmail = (applicationId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield client_1.prisma.jobApplication.findUnique({
        where: { id: applicationId },
        include: {
            user: { select: { email: true, Fullname: true } },
            jobPost: {
                include: {
                    company: { select: { name: true } },
                },
            },
        },
    });
    if (!application)
        return;
    let subject = '';
    let content = '';
    switch (status) {
        case 'VIEWED':
            subject = `Đơn ứng tuyển đã được xem - ${application.jobPost.title}`;
            content = `
        <h2>Xin chào ${application.user.Fullname},</h2>
        <p>Đơn ứng tuyển của bạn cho vị trí <strong>${application.jobPost.title}</strong> tại <strong>${application.jobPost.company.name}</strong> đã được xem.</p>
        <p>Trân trọng,<br/>Career CV Team</p>
      `;
            break;
        case 'ACCEPTED':
            subject = `Chúc mừng! Đơn ứng tuyển được chấp nhận - ${application.jobPost.title}`;
            content = `
        <h2>Xin chào ${application.user.Fullname},</h2>
        <p>Chúc mừng! Đơn ứng tuyển của bạn cho vị trí <strong>${application.jobPost.title}</strong> tại <strong>${application.jobPost.company.name}</strong> đã được chấp nhận.</p>
        <p>Nhà tuyển dụng sẽ liên hệ với bạn sớm để tiếp tục quy trình phỏng vấn.</p>
        <p>Trân trọng,<br/>Career CV Team</p>
      `;
            break;
        case 'REJECTED':
            subject = `Kết quả đơn ứng tuyển - ${application.jobPost.title}`;
            content = `
        <h2>Xin chào ${application.user.Fullname},</h2>
        <p>Cảm ơn bạn đã quan tâm đến vị trí <strong>${application.jobPost.title}</strong> tại <strong>${application.jobPost.company.name}</strong>.</p>
        <p>Sau khi xem xét kỹ lưỡng, chúng tôi rất tiếc phải thông báo rằng đơn ứng tuyển của bạn chưa phù hợp với yêu cầu hiện tại.</p>
        <p>Chúng tôi khuyến khích bạn tiếp tục theo dõi và ứng tuyển các vị trí khác phù hợp.</p>
        <p>Trân trọng,<br/>Career CV Team</p>
      `;
            break;
    }
    if (subject && content) {
        yield (0, exports.sendEmail)(application.user.email, subject, content, 'APPLY_JOB', application.userId);
    }
});
exports.sendStatusUpdateEmail = sendStatusUpdateEmail;
// Send invitation email (HR to candidate)
const sendInvitationEmail = (toEmail, candidateName, jobTitle, companyName, message, hrUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = `Thư mời ứng tuyển - ${jobTitle} tại ${companyName}`;
    const content = `
    <h2>Xin chào ${candidateName},</h2>
    <p>Chúng tôi từ <strong>${companyName}</strong> đã xem qua hồ sơ của bạn và rất ấn tượng.</p>
    <p>Chúng tôi muốn mời bạn ứng tuyển vào vị trí <strong>${jobTitle}</strong>.</p>
    <p><strong>Lời nhắn từ nhà tuyển dụng:</strong></p>
    <p>${message}</p>
    <p>Hãy đăng nhập vào Career CV để xem chi tiết và ứng tuyển ngay!</p>
    <p>Trân trọng,<br/>${companyName}</p>
  `;
    return yield (0, exports.sendEmail)(toEmail, subject, content, 'INVITATION', hrUserId);
});
exports.sendInvitationEmail = sendInvitationEmail;
// Get email history
const getEmailHistory = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [emails, total] = yield Promise.all([
        client_1.prisma.email.findMany({
            where: { userId },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        }),
        client_1.prisma.email.count({ where: { userId } }),
    ]);
    return {
        emails,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
exports.getEmailHistory = getEmailHistory;
// Contact Us
const submitContactUs = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const contact = yield client_1.prisma.contactUs.create({
        data,
    });
    // Send confirmation email to user
    const content = `
    <h2>Xin chào ${data.name},</h2>
    <p>Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi sớm nhất có thể.</p>
    <p><strong>Nội dung tin nhắn:</strong></p>
    <p>${data.message}</p>
    <p>Trân trọng,<br/>Career CV Team</p>
  `;
    try {
        yield (0, exports.sendEmail)(data.email, 'Xác nhận liên hệ - Career CV', content, 'SYSTEM');
    }
    catch (error) {
        // Ignore email error, still return success
    }
    return contact;
});
exports.submitContactUs = submitContactUs;
// Get all contacts (Admin)
const getAllContacts = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [contacts, total] = yield Promise.all([
        client_1.prisma.contactUs.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        }),
        client_1.prisma.contactUs.count(),
    ]);
    return {
        contacts,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
});
exports.getAllContacts = getAllContacts;
// Resolve contact (Admin)
const resolveContact = (contactId) => __awaiter(void 0, void 0, void 0, function* () {
    const contact = yield client_1.prisma.contactUs.update({
        where: { id: contactId },
        data: { isResolved: true },
    });
    return contact;
});
exports.resolveContact = resolveContact;
//# sourceMappingURL=email.service.js.map