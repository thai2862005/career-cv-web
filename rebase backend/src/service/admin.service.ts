import { prisma } from '../config/client';
import bcrypt from 'bcrypt';
import { authConfig } from '../config/auth';

// Get dashboard statistics
export const getDashboardStats = async () => {
  const [
    totalUsers,
    totalCompanies,
    totalJobs,
    totalApplications,
    pendingJobs,
    usersByRole,
    applicationsByStatus,
    recentJobs,
    recentApplications,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.company.count(),
    prisma.jobPost.count(),
    prisma.jobApplication.count(),
    prisma.jobPost.count({ where: { isApproved: false } }),
    prisma.user.groupBy({
      by: ['roleId'],
      _count: true,
    }),
    prisma.jobApplication.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.jobPost.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        company: { select: { name: true } },
      },
    }),
    prisma.jobApplication.findMany({
      take: 5,
      orderBy: { appliedAt: 'desc' },
      include: {
        user: { select: { Fullname: true } },
        jobPost: { select: { title: true } },
      },
    }),
  ]);

  return {
    overview: {
      totalUsers,
      totalCompanies,
      totalJobs,
      totalApplications,
      pendingJobs,
    },
    usersByRole,
    applicationsByStatus,
    recentJobs,
    recentApplications,
  };
};

// Get all users (Admin)
export const getAllUsers = async (page: number = 1, limit: number = 20, roleId?: number) => {
  const skip = (page - 1) * limit;

  const where: any = {};
  if (roleId) {
    where.roleId = roleId;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
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
        emailVerified: true,
        roleId: true,
        role: true,
        createdAt: true,
        _count: {
          select: { applications: true, cvs: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
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

// Get user by ID (Admin)
export const getUserById = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
        orderBy: { appliedAt: 'desc' },
        take: 10,
      },
      company: true,
    },
  });

  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Update user (Admin)
export const updateUser = async (userId: number, data: {
  Fullname?: string;
  phone?: string;
  address?: string;
  roleId?: number;
  isActive?: boolean;
}) => {
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

// Toggle user status (Admin)
export const toggleUserStatus = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
    include: { role: true },
  });

  return updatedUser;
};

// Delete user (Admin)
export const deleteUser = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  // Check if user is admin
  if (user.roleId === 3) {
    throw new Error('Không thể xóa tài khoản admin');
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return { message: 'Xóa người dùng thành công' };
};

// Reset user password (Admin)
export const resetUserPassword = async (userId: number, newPassword: string) => {
  const hashedPassword = await bcrypt.hash(newPassword, authConfig.bcryptSaltRounds);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: 'Đặt lại mật khẩu thành công' };
};

// Get all roles
export const getAllRoles = async () => {
  const roles = await prisma.role.findMany({
    include: {
      _count: {
        select: { users: true },
      },
    },
  });

  return roles;
};

// Get system reports
export const getSystemReports = async (startDate?: Date, endDate?: Date) => {
  const dateFilter: any = {};
  if (startDate) {
    dateFilter.gte = startDate;
  }
  if (endDate) {
    dateFilter.lte = endDate;
  }

  const [
    newUsers,
    newJobs,
    newApplications,
    jobsByCategory,
    topCompanies,
  ] = await Promise.all([
    prisma.user.count({
      where: dateFilter.gte || dateFilter.lte ? { createdAt: dateFilter } : {},
    }),
    prisma.jobPost.count({
      where: dateFilter.gte || dateFilter.lte ? { createdAt: dateFilter } : {},
    }),
    prisma.jobApplication.count({
      where: dateFilter.gte || dateFilter.lte ? { appliedAt: dateFilter } : {},
    }),
    prisma.jobPost.groupBy({
      by: ['categoryId'],
      _count: true,
      orderBy: { _count: { categoryId: 'desc' } },
      take: 10,
    }),
    prisma.company.findMany({
      take: 10,
      include: {
        _count: {
          select: { jobs: true },
        },
      },
      orderBy: {
        jobs: {
          _count: 'desc',
        },
      },
    }),
  ]);

  return {
    newUsers,
    newJobs,
    newApplications,
    jobsByCategory,
    topCompanies,
  };
};

// Get all companies (Admin)
export const getAllCompaniesAdmin = async (page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      skip,
      take: limit,
      include: {
        hrUser: {
          select: { id: true, email: true, Fullname: true },
        },
        _count: {
          select: { jobs: true, reviews: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.company.count(),
  ]);

  return {
    companies,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
