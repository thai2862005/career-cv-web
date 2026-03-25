import { prisma } from '../config/client';
import { ApplyJobInput } from '../validation/job';
import { ApplyStatus } from '@prisma/client';

// Apply for job
export const applyForJob = async (userId: number, data: ApplyJobInput) => {
  const { jobPostId, cvId, coverLetter } = data;

  // Check if job exists and is active
  const job = await prisma.jobPost.findFirst({
    where: { id: jobPostId, isActive: true, isApproved: true },
  });

  if (!job) {
    throw new Error('Tin tuyển dụng không tồn tại hoặc đã hết hạn');
  }

  // Check if CV exists and belongs to user
  const cv = await prisma.cV.findFirst({
    where: { id: cvId, userId },
  });

  if (!cv) {
    throw new Error('CV không tồn tại');
  }

  // Check if already applied
  const existingApplication = await prisma.jobApplication.findFirst({
    where: { userId, jobPostId },
  });

  if (existingApplication) {
    throw new Error('Bạn đã ứng tuyển vị trí này');
  }

  // Create application
  const application = await prisma.jobApplication.create({
    data: {
      userId,
      jobPostId,
      cvId,
      coverLetter,
    },
    include: {
      jobPost: {
        include: {
          company: {
            select: { id: true, name: true, logoUrl: true },
          },
        },
      },
      cv: true,
    },
  });

  return application;
};

// Get user applications
export const getUserApplications = async (userId: number, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const [applications, total] = await Promise.all([
    prisma.jobApplication.findMany({
      where: { userId },
      skip,
      take: limit,
      include: {
        jobPost: {
          include: {
            company: {
              select: { id: true, name: true, logoUrl: true, location: true },
            },
          },
        },
        cv: true,
      },
      orderBy: { appliedAt: 'desc' },
    }),
    prisma.jobApplication.count({ where: { userId } }),
  ]);

  return {
    applications,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get application by ID
export const getApplicationById = async (applicationId: number, userId: number) => {
  const application = await prisma.jobApplication.findFirst({
    where: { id: applicationId, userId },
    include: {
      jobPost: {
        include: {
          company: true,
        },
      },
      cv: true,
    },
  });

  if (!application) {
    throw new Error('Không tìm thấy đơn ứng tuyển');
  }

  return application;
};

// Cancel application
export const cancelApplication = async (applicationId: number, userId: number) => {
  const application = await prisma.jobApplication.findFirst({
    where: { id: applicationId, userId },
  });

  if (!application) {
    throw new Error('Không tìm thấy đơn ứng tuyển');
  }

  if (application.status !== 'PENDING') {
    throw new Error('Không thể hủy đơn đã được xử lý');
  }

  await prisma.jobApplication.delete({
    where: { id: applicationId },
  });

  return { message: 'Hủy đơn ứng tuyển thành công' };
};

// Get job applications (HR)
export const getJobApplications = async (
  jobPostId: number,
  companyId: number,
  page: number = 1,
  limit: number = 10,
  status?: ApplyStatus
) => {
  const skip = (page - 1) * limit;

  // Verify job belongs to company
  const job = await prisma.jobPost.findFirst({
    where: { id: jobPostId, companyId },
  });

  if (!job) {
    throw new Error('Không tìm thấy tin tuyển dụng');
  }

  const where: any = { jobPostId };
  if (status) {
    where.status = status;
  }

  const [applications, total] = await Promise.all([
    prisma.jobApplication.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: { id: true, Fullname: true, email: true, phone: true, avatar: true },
        },
        cv: true,
      },
      orderBy: { appliedAt: 'desc' },
    }),
    prisma.jobApplication.count({ where }),
  ]);

  return {
    applications,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Update application status (HR)
export const updateApplicationStatus = async (
  applicationId: number,
  companyId: number,
  status: ApplyStatus,
  note?: string
) => {
  // Verify application belongs to company's job
  const application = await prisma.jobApplication.findFirst({
    where: {
      id: applicationId,
      jobPost: { companyId },
    },
  });

  if (!application) {
    throw new Error('Không tìm thấy đơn ứng tuyển');
  }

  const updatedApplication = await prisma.jobApplication.update({
    where: { id: applicationId },
    data: {
      status,
      note,
      reviewedAt: new Date(),
    },
    include: {
      user: {
        select: { id: true, Fullname: true, email: true },
      },
      jobPost: true,
    },
  });

  return updatedApplication;
};

// Get all applications for company (HR)
export const getCompanyApplications = async (
  companyId: number,
  page: number = 1,
  limit: number = 10,
  status?: ApplyStatus
) => {
  const skip = (page - 1) * limit;

  const where: any = {
    jobPost: { companyId },
  };

  if (status) {
    where.status = status;
  }

  const [applications, total] = await Promise.all([
    prisma.jobApplication.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: { id: true, Fullname: true, email: true, phone: true, avatar: true },
        },
        jobPost: {
          select: { id: true, title: true },
        },
        cv: true,
      },
      orderBy: { appliedAt: 'desc' },
    }),
    prisma.jobApplication.count({ where }),
  ]);

  return {
    applications,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get application statistics (HR)
export const getApplicationStats = async (companyId: number) => {
  const stats = await prisma.jobApplication.groupBy({
    by: ['status'],
    where: {
      jobPost: { companyId },
    },
    _count: true,
  });

  const total = await prisma.jobApplication.count({
    where: {
      jobPost: { companyId },
    },
  });

  return {
    total,
    byStatus: stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count;
      return acc;
    }, {} as Record<string, number>),
  };
};

// Search candidates (HR)
export const searchCandidates = async (
  keyword: string,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  const where: any = {};

  if (keyword) {
    where.OR = [
      { Fullname: { contains: keyword } },
      { email: { contains: keyword } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: {
        ...where,
        roleId: 1, // Job seekers only
        cvs: { some: {} }, // Has at least one CV
      },
      skip,
      take: limit,
      select: {
        id: true,
        Fullname: true,
        email: true,
        phone: true,
        avatar: true,
        address: true,
        cvs: {
          where: { isDefault: true },
          take: 1,
        },
        _count: {
          select: { applications: true },
        },
      },
    }),
    prisma.user.count({
      where: {
        ...where,
        roleId: 1,
        cvs: { some: {} },
      },
    }),
  ]);

  return {
    candidates: users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
