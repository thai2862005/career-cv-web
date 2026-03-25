import { Request, Response } from 'express';
import * as notificationService from '../service/notification.service';

// Get my notifications
export const getMyNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await notificationService.getUserNotifications(req.user.id, page, limit);

    res.status(200).json({
      success: true,
      data: result.notifications,
      unreadCount: result.unreadCount,
      meta: result.meta,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy thông báo thất bại',
    });
  }
};

// Mark as read
export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const notificationId = parseInt(req.params.id);
    const notification = await notificationService.markAsRead(notificationId, req.user.id);

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Cập nhật thất bại',
    });
  }
};

// Mark all as read
export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const result = await notificationService.markAllAsRead(req.user.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Cập nhật thất bại',
    });
  }
};

// Delete notification
export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const notificationId = parseInt(req.params.id);
    const result = await notificationService.deleteNotification(notificationId, req.user.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Xóa thất bại',
    });
  }
};

// Get my messages
export const getMyMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await notificationService.getUserMessages(req.user.id, page, limit);

    res.status(200).json({
      success: true,
      data: result.messages,
      meta: result.meta,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy tin nhắn thất bại',
    });
  }
};

// Create message
export const createMessage = async (req: Request, res: Response): Promise<void> => {
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

    const message = await notificationService.createMessage(req.user.id, content);

    res.status(201).json({
      success: true,
      message: 'Gửi tin nhắn thành công',
      data: message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Gửi tin nhắn thất bại',
    });
  }
};
