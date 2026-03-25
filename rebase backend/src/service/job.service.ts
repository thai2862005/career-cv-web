import { prisma } from '../config/client';
import { CreateJobPostInput, UpdateJobPostInput, SearchJobInput } from '../validation/job';

// Create job post
export const createJobPost = async (companyId: number, data: CreateJobPostInput) => {
  const jobPost = await prisma.jobPost.create({
    data: {
      title: data.title,
      description: data.description,
      requirements: data.requirements || null,
      benefits: data.benefits || null,
      location: data.location,
      salary: data.salary || null,
      salaryMax: data.salaryMax || null,
      jobType: data.jobType || 'FULL_TIME',
      experience: data.experience || null,
      deadline: data.deadline ? new Date(data.deadline) : null,
      company: {
        connect: { id: companyId },
      },
      ...(data.categoryId && {
        category: {
          connect: { id: data.categoryId },
        },
      }),
    },
    include: {
      company: true,
      category: true,
    },
  });

  return jobPost;
};

// Get all job posts (public)
export const getAllJobPosts = async (filters: SearchJobInput) => {
  const { keyword, location, categoryId, jobType, salaryMin, salaryMax, page, limit } = filters;
  const skip = (page - 1) * limit;

  const where: any = {
    isActive: true,
    isApproved: true,
  };

  if (keyword) {
    where.OR = [
      { title: { contains: keyword } },
      { description: { contains: keyword } },
      { company: { name: { contains: keyword } } },
    ];
  }

  if (location) {
    where.location = { contains: location };
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (jobType) {
    where.jobType = jobType;
  }

  if (salaryMin !== undefined) {
    where.salary = { gte: salaryMin };
  }

  if (salaryMax !== undefined) {
    where.salary = { ...where.salary, lte: salaryMax };
  }

  const [jobs, total] = await Promise.all([
    prisma.jobPost.findMany({
      where,
      skip,
      take: limit,
      include: {
        company: {
          select: { id: true, name: true, logoUrl: true, location: true },
        },
        category: true,
        _count: {
          select: { applies: true, savedBy: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.jobPost.count({ where }),
  ]);

  return {
    jobs,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get job post by ID
export const getJobPostById = async (jobId: number) => {
  const job = await prisma.jobPost.findUnique({
    where: { id: jobId },
    include: {
      company: true,
      category: true,
      _count: {
        select: { applies: true, savedBy: true },
      },
    },
  });

  if (!job) {
    throw new Error('Không tìm thấy tin tuyển dụng');
  }

  // Increment view count
  await prisma.jobPost.update({
    where: { id: jobId },
    data: { viewCount: { increment: 1 } },
  });

  return job;
};

// Update job post
export const updateJobPost = async (jobId: number, companyId: number, data: UpdateJobPostInput) => {
  const job = await prisma.jobPost.findFirst({
    where: { id: jobId, companyId },
  });

  if (!job) {
    throw new Error('Không tìm thấy tin tuyển dụng hoặc bạn không có quyền');
  }

  const updatedJob = await prisma.jobPost.update({
    where: { id: jobId },
    data: {
      ...data,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
    },
    include: {
      company: true,
      category: true,
    },
  });

  return updatedJob;
};

// Delete job post
export const deleteJobPost = async (jobId: number, companyId: number) => {
  const job = await prisma.jobPost.findFirst({
    where: { id: jobId, companyId },
  });

  if (!job) {
    throw new Error('Không tìm thấy tin tuyển dụng hoặc bạn không có quyền');
  }

  await prisma.jobPost.delete({
    where: { id: jobId },
  });

  return { message: 'Xóa tin tuyển dụng thành công' };
};

// Toggle job active status
export const toggleJobStatus = async (jobId: number, companyId: number) => {
  const job = await prisma.jobPost.findFirst({
    where: { id: jobId, companyId },
  });

  if (!job) {
    throw new Error('Không tìm thấy tin tuyển dụng');
  }

  const updatedJob = await prisma.jobPost.update({
    where: { id: jobId },
    data: { isActive: !job.isActive },
  });

  return updatedJob;
};

// Get company jobs (HR)
export const getCompanyJobs = async (companyId: number, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const [jobs, total] = await Promise.all([
    prisma.jobPost.findMany({
      where: { companyId },
      skip,
      take: limit,
      include: {
        category: true,
        _count: {
          select: { applies: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.jobPost.count({ where: { companyId } }),
  ]);

  return {
    jobs,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Approve job post (Admin)
export const approveJobPost = async (jobId: number, isApproved: boolean) => {
  const job = await prisma.jobPost.update({
    where: { id: jobId },
    data: { isApproved },
    include: {
      company: true,
    },
  });

  return job;
};

// Get pending jobs (Admin)
export const getPendingJobs = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const [jobs, total] = await Promise.all([
    prisma.jobPost.findMany({
      where: { isApproved: false },
      skip,
      take: limit,
      include: {
        company: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.jobPost.count({ where: { isApproved: false } }),
  ]);

  return {
    jobs,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Save job
export const saveJob = async (userId: number, jobPostId: number) => {
  const existingSave = await prisma.savedJob.findUnique({
    where: {
      userId_jobPostId: { userId, jobPostId },
    },
  });

  if (existingSave) {
    throw new Error('Đã lưu tin này');
  }

  const savedJob = await prisma.savedJob.create({
    data: { userId, jobPostId },
    include: {
      jobPost: {
        include: {
          company: {
            select: { id: true, name: true, logoUrl: true },
          },
        },
      },
    },
  });

  return savedJob;
};

// Unsave job
export const unsaveJob = async (userId: number, jobPostId: number) => {
  const savedJob = await prisma.savedJob.findUnique({
    where: {
      userId_jobPostId: { userId, jobPostId },
    },
  });

  if (!savedJob) {
    throw new Error('Chưa lưu tin này');
  }

  await prisma.savedJob.delete({
    where: {
      userId_jobPostId: { userId, jobPostId },
    },
  });

  return { message: 'Bỏ lưu thành công' };
};

// Get saved jobs
export const getSavedJobs = async (userId: number, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const [savedJobs, total] = await Promise.all([
    prisma.savedJob.findMany({
      where: { userId },
      skip,
      take: limit,
      include: {
        jobPost: {
          include: {
            company: {
              select: { id: true, name: true, logoUrl: true, location: true },
            },
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.savedJob.count({ where: { userId } }),
  ]);

  return {
    savedJobs,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
