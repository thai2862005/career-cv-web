import nodemailer from 'nodemailer';
import { prisma } from '../config/client';
import { emailConfig } from '../config/auth';
import { EmailType, EmailStatus } from '@prisma/client';

// Create transporter
const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: {
    user: emailConfig.auth.user,
    pass: emailConfig.auth.pass,
  },
});

// Send email
export const sendEmail = async (
  to: string,
  subject: string,
  content: string,
  type: EmailType,
  userId?: number
) => {
  // Create email record
  const email = await prisma.email.create({
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
    await transporter.sendMail({
      from: emailConfig.from,
      to,
      subject,
      html: content,
    });

    // Update status
    await prisma.email.update({
      where: { id: email.id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
      },
    });

    return { success: true, message: 'Email đã được gửi' };
  } catch (error) {
    // Update status with error
    await prisma.email.update({
      where: { id: email.id },
      data: {
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    throw new Error('Gửi email thất bại');
  }
};

// Send application confirmation email
export const sendApplicationEmail = async (applicationId: number) => {
  const application = await prisma.jobApplication.findUnique({
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

  if (!application) return;

  const subject = `Xác nhận ứng tuyển - ${application.jobPost.title}`;
  const content = `
    <h2>Xin chào ${application.user.Fullname},</h2>
    <p>Chúng tôi đã nhận được đơn ứng tuyển của bạn cho vị trí <strong>${application.jobPost.title}</strong> tại <strong>${application.jobPost.company.name}</strong>.</p>
    <p>Chúng tôi sẽ xem xét hồ sơ của bạn và liên hệ sớm nhất có thể.</p>
    <p>Trân trọng,<br/>Career CV Team</p>
  `;

  await sendEmail(
    application.user.email,
    subject,
    content,
    'APPLY_JOB',
    application.userId
  );
};

// Send status update email
export const sendStatusUpdateEmail = async (applicationId: number, status: string) => {
  const application = await prisma.jobApplication.findUnique({
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

  if (!application) return;

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
    await sendEmail(
      application.user.email,
      subject,
      content,
      'APPLY_JOB',
      application.userId
    );
  }
};

// Send invitation email (HR to candidate)
export const sendInvitationEmail = async (
  toEmail: string,
  candidateName: string,
  jobTitle: string,
  companyName: string,
  message: string,
  hrUserId: number
) => {
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

  return await sendEmail(toEmail, subject, content, 'INVITATION', hrUserId);
};

// Get email history
export const getEmailHistory = async (userId: number, page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;

  const [emails, total] = await Promise.all([
    prisma.email.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.email.count({ where: { userId } }),
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
};

// Contact Us
export const submitContactUs = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const contact = await prisma.contactUs.create({
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
    await sendEmail(data.email, 'Xác nhận liên hệ - Career CV', content, 'SYSTEM');
  } catch (error) {
    // Ignore email error, still return success
  }

  return contact;
};

// Get all contacts (Admin)
export const getAllContacts = async (page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;

  const [contacts, total] = await Promise.all([
    prisma.contactUs.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.contactUs.count(),
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
};

// Resolve contact (Admin)
export const resolveContact = async (contactId: number) => {
  const contact = await prisma.contactUs.update({
    where: { id: contactId },
    data: { isResolved: true },
  });

  return contact;
};
