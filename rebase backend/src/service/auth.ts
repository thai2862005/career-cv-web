import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { prisma } from '../config/client';
import { authConfig, ROLES } from '../config/auth';
import { RegisterInput, LoginInput } from '../validation/auth';
import { JwtPayload } from '../type';

// Register new user
export const registerUser = async (data: RegisterInput) => {
  const { email, password, Fullname, phone, address, roleId } = data;

  // Check if email exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email đã được sử dụng');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, authConfig.bcryptSaltRounds);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      Fullname,
      phone,
      address,
      roleId: roleId || ROLES.JOB_SEEKER,
    },
    include: {
      role: true,
    },
  });

  // Generate token
  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      email: user.email,
      Fullname: user.Fullname,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar,
      role: user.role.name,
    },
    token,
  };
};

// Login user
export const loginUser = async (data: LoginInput) => {
  const { email, password } = data;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
    },
  });

  if (!user) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }

  if (!user.isActive) {
    throw new Error('Tài khoản đã bị khóa');
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }

  // Generate token
  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      email: user.email,
      Fullname: user.Fullname,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar,
      role: user.role.name,
      roleId: user.roleId,
    },
    token,
  };
};

// Get user profile
export const getUserProfile = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: true,
      cvs: true,
      company: true,
    },
  });

  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Update profile
export const updateUserProfile = async (userId: number, data: Partial<{
  Fullname: string;
  phone: string;
  address: string;
  avatar: string;
}>) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    include: {
      role: true,
    },
  });

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Change password
export const changePassword = async (userId: number, currentPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  const isValidPassword = await bcrypt.compare(currentPassword, user.password);
  if (!isValidPassword) {
    throw new Error('Mật khẩu hiện tại không đúng');
  }

  const hashedPassword = await bcrypt.hash(newPassword, authConfig.bcryptSaltRounds);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: 'Đổi mật khẩu thành công' };
};

// Generate JWT token
const generateToken = (user: { id: number; email: string; roleId: number; role: { name: string } }) => {
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    roleId: user.roleId,
    roleName: user.role.name,
  };

  const secret: jwt.Secret = authConfig.jwtSecret as unknown as jwt.Secret;
  const options: jwt.SignOptions = {
    expiresIn: authConfig.jwtExpiresIn as unknown as jwt.SignOptions['expiresIn'],
  };

  return jwt.sign(payload as string | Buffer | object, secret, options);
};
