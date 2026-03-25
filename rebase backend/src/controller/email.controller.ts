import { Request, Response } from 'express';
import * as emailService from '../service/email.service';
import { z } from 'zod';
import { ZodError } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  subject: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
  message: z.string().min(10, 'Nội dung phải có ít nhất 10 ký tự'),
});

const invitationSchema = z.object({
  toEmail: z.string().email('Email không hợp lệ'),
  candidateName: z.string().min(2),
  jobTitle: z.string().min(2),
  companyName: z.string().min(2),
  message: z.string().min(10),
});

// Send invitation email (HR)
export const sendInvitation = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const validatedData = invitationSchema.parse(req.body);
    
    await emailService.sendInvitationEmail(
      validatedData.toEmail,
      validatedData.candidateName,
      validatedData.jobTitle,
      validatedData.companyName,
      validatedData.message,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: 'Gửi thư mời thành công',
    });
  } catch (error) {
    if (error instanceof ZodError) {
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
};

// Get email history
export const getEmailHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await emailService.getEmailHistory(req.user.id, page, limit);

    res.status(200).json({
      success: true,
      data: result.emails,
      meta: result.meta,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy lịch sử email thất bại',
    });
  }
};

// Submit contact form
export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = contactSchema.parse(req.body);
    const contact = await emailService.submitContactUs({
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
  } catch (error) {
    if (error instanceof ZodError) {
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
};

// Get all contacts (Admin)
export const getAllContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await emailService.getAllContacts(page, limit);

    res.status(200).json({
      success: true,
      data: result.contacts,
      meta: result.meta,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy danh sách thất bại',
    });
  }
};

// Resolve contact (Admin)
export const resolveContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const contactId = parseInt(req.params.id);
    const contact = await emailService.resolveContact(contactId);

    res.status(200).json({
      success: true,
      message: 'Đã xử lý liên hệ',
      data: contact,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Cập nhật thất bại',
    });
  }
};
