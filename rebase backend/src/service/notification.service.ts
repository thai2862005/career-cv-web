import { prisma } from '../config/client';
import { NotificationType } from '@prisma/client';

// Create notification
export const createNotification = async (
  userId: number,
  title: string,
  content: string,
  type: NotificationType,
  link?: string
) => {
  const notification = await prisma.notification.create({
    data: {
      userId,
      title,
      content,
      type,
      link,
    },
  });

  return notification;
};

// Get user notifications
export const getUserNotifications = async (userId: number, page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.count({ where: { userId } }),
    prisma.notification.count({ where: { userId, isRead: false } }),
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
};

// Mark notification as read
export const markAsRead = async (notificationId: number, userId: number) => {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });

  if (!notification) {
    throw new Error('Không tìm thấy thông báo');
  }

  const updated = await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });

  return updated;
};

// Mark all as read
export const markAllAsRead = async (userId: number) => {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });

  return { message: 'Đã đánh dấu tất cả đã đọc' };
};

// Delete notification
export const deleteNotification = async (notificationId: number, userId: number) => {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });

  if (!notification) {
    throw new Error('Không tìm thấy thông báo');
  }

  await prisma.notification.delete({
    where: { id: notificationId },
  });

  return { message: 'Xóa thông báo thành công' };
};

// Create message
export const createMessage = async (userId: number, content: string) => {
  const message = await prisma.message.create({
    data: {
      userId,
      content,
    },
  });

  return message;
};

// Get user messages
export const getUserMessages = async (userId: number, page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.message.count({ where: { userId } }),
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
};

// Send notification to HR when user applies
export const notifyHROnApplication = async (applicationId: number) => {
  const application = await prisma.jobApplication.findUnique({
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
    await createNotification(
      application.jobPost.company.hrUserId,
      'Đơn ứng tuyển mới',
      `${application.user.Fullname} đã ứng tuyển vào vị trí ${application.jobPost.title}`,
      'APPLICATION_STATUS',
      `/hr/applications/${applicationId}`
    );
  }
};

// Send notification to user on status change
export const notifyUserOnStatusChange = async (
  applicationId: number,
  status: string
) => {
  const application = await prisma.jobApplication.findUnique({
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

    await createNotification(
      application.userId,
      'Cập nhật đơn ứng tuyển',
      message,
      'APPLICATION_STATUS',
      `/applications/${applicationId}`
    );
  }
};
