import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  Fullname: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  phone: z.string().optional(),
  address: z.string().optional(),
  roleId: z.number().optional().default(1), // 1: Job Seeker, 2: HR, 3: Admin
});

export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống'),
});

export const updateProfileSchema = z.object({
  Fullname: z.string().min(2).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatar: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mật khẩu hiện tại không được để trống'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
