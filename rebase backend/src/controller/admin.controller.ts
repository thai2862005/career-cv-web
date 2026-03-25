import { Request, Response } from 'express';
import * as adminService from '../service/admin.service';
import { z } from 'zod';
import { ZodError } from 'zod';

const updateUserSchema = z.object({
  Fullname: z.string().min(2).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  roleId: z.number().optional(),
  isActive: z.boolean().optional(),
});

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

// Get dashboard stats
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await adminService.getDashboardStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy thống kê thất bại',
    });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const roleId = req.query.roleId ? parseInt(req.query.roleId as string) : undefined;

    const result = await adminService.getAllUsers(page, limit, roleId);

    res.status(200).json({
      success: true,
      data: result.users,
      meta: result.meta,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy danh sách thất bại',
    });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    const user = await adminService.getUserById(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : 'Không tìm thấy',
    });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    const validatedData = updateUserSchema.parse(req.body);
    const user = await adminService.updateUser(userId, validatedData);

    res.status(200).json({
      success: true,
      message: 'Cập nhật người dùng thành công',
      data: user,
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
      message: error instanceof Error ? error.message : 'Cập nhật thất bại',
    });
  }
};

// Toggle user status
export const toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    const user = await adminService.toggleUserStatus(userId);

    res.status(200).json({
      success: true,
      message: user.isActive ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Cập nhật thất bại',
    });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    const result = await adminService.deleteUser(userId);

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

// Reset user password
export const resetUserPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    const validatedData = resetPasswordSchema.parse(req.body);
    const result = await adminService.resetUserPassword(userId, validatedData.newPassword);

    res.status(200).json({
      success: true,
      message: result.message,
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
      message: error instanceof Error ? error.message : 'Đặt lại mật khẩu thất bại',
    });
  }
};

// Get all roles
export const getAllRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = await adminService.getAllRoles();

    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy danh sách thất bại',
    });
  }
};

// Get system reports
export const getSystemReports = async (req: Request, res: Response): Promise<void> => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const reports = await adminService.getSystemReports(startDate, endDate);

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy báo cáo thất bại',
    });
  }
};

// Get all companies (Admin)
export const getAllCompanies = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await adminService.getAllCompaniesAdmin(page, limit);

    res.status(200).json({
      success: true,
      data: result.companies,
      meta: result.meta,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy danh sách thất bại',
    });
  }
};
