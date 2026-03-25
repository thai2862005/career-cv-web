import { prisma } from "../../config/client";
import bcrypt from 'bcrypt';
import { authConfig } from '../../config/auth';

// Create user (internal use)
const CreateUser = async (
  name: string,
  phone: string,
  address: string,
  email: string,
  password: string,
  avatar: string,
  roleId: string
) => {
  const hashedPassword = await bcrypt.hash(password, authConfig.bcryptSaltRounds);
  
  const user = await prisma.user.create({
    data: {
      Fullname: name,
      phone,
      address,
      avatar,
      email,
      password: hashedPassword,
      roleId: +roleId,
    },
    include: {
      role: true,
    },
  });

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Get all users with pagination
const GetAllUsers = async (page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        Fullname: true,
        phone: true,
        address: true,
        avatar: true,
        isActive: true,
        roleId: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ]);

  return {
    users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Delete user
const DeleteUser = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  await prisma.user.delete({
    where: { id },
  });

  return { message: 'Xóa người dùng thành công' };
};

// Get user by ID
const GetUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      role: true,
      cvs: true,
      applications: {
        include: {
          jobPost: {
            include: {
              company: { select: { name: true } },
            },
          },
        },
        take: 10,
        orderBy: { appliedAt: 'desc' },
      },
    },
  });

  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Update user
const UpdateUser = async (
  id: number,
  data: {
    Fullname?: string;
    phone?: string;
    address?: string;
    avatar?: string;
  }
) => {
  const user = await prisma.user.update({
    where: { id },
    data,
    include: { role: true },
  });

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export { CreateUser, GetAllUsers, DeleteUser, GetUserById, UpdateUser };