import { Request, Response } from 'express';
import * as authService from '../service/auth';
import { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } from '../validation/auth';
import { ZodError } from 'zod';

// Register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.registerUser(validatedData);
    
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: result,
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
      message: error instanceof Error ? error.message : 'Đăng ký thất bại',
    });
  }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.loginUser(validatedData);
    
    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: result,
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
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Đăng nhập thất bại',
    });
  }
};

// Get Profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const user = await authService.getUserProfile(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy thông tin thất bại',
    });
  }
};

// Update Profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const validatedData = updateProfileSchema.parse(req.body);
    const user = await authService.updateUserProfile(req.user.id, validatedData);
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật thành công',
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

// Change Password
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const validatedData = changePasswordSchema.parse(req.body);
    const result = await authService.changePassword(
      req.user.id,
      validatedData.currentPassword,
      validatedData.newPassword
    );
    
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
      message: error instanceof Error ? error.message : 'Đổi mật khẩu thất bại',
    });
  }
};
