import { prisma } from '../config/client';
import { CreateCompanyInput, UpdateCompanyInput, CompanyReviewInput } from '../validation/company';

// Create company
export const createCompany = async (hrUserId: number, data: CreateCompanyInput) => {
  // Check if HR already has a company
  const existingCompany = await prisma.company.findFirst({
    where: { hrUserId },
  });

  if (existingCompany) {
    throw new Error('Bạn đã có công ty');
  }

  const company = await prisma.company.create({
    data: {
      name: data.name,
      description: data.description,
      location: data.location,
      website: data.website || null,
      logoUrl: data.logoUrl || null,
      coverImage: data.coverImage || null,
      size: data.size || null,
      industry: data.industry || null,
      hrUser: {
        connect: { id: hrUserId },
      },
    },
  });

  return company;
};

// Get all companies
export const getAllCompanies = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      skip,
      take: limit,
      include: {
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

// Get company by ID
export const getCompanyById = async (companyId: number) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      jobs: {
        where: { isActive: true, isApproved: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      reviews: {
        include: {
          user: {
            select: { id: true, Fullname: true, avatar: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      _count: {
        select: { jobs: true, reviews: true },
      },
    },
  });

  if (!company) {
    throw new Error('Không tìm thấy công ty');
  }

  // Calculate average rating
  const avgRating = await prisma.companyReview.aggregate({
    where: { companyId },
    _avg: { rating: true },
  });

  return {
    ...company,
    avgRating: avgRating._avg.rating || 0,
  };
};

// Update company
export const updateCompany = async (companyId: number, hrUserId: number, data: UpdateCompanyInput) => {
  const company = await prisma.company.findFirst({
    where: { id: companyId, hrUserId },
  });

  if (!company) {
    throw new Error('Không tìm thấy công ty hoặc bạn không có quyền');
  }

  const updatedCompany = await prisma.company.update({
    where: { id: companyId },
    data,
  });

  return updatedCompany;
};

// Delete company (Admin only)
export const deleteCompany = async (companyId: number) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw new Error('Không tìm thấy công ty');
  }

  await prisma.company.delete({
    where: { id: companyId },
  });

  return { message: 'Xóa công ty thành công' };
};

// Verify company (Admin only)
export const verifyCompany = async (companyId: number, isVerified: boolean) => {
  const company = await prisma.company.update({
    where: { id: companyId },
    data: { isVerified },
  });

  return company;
};

// Get my company (HR)
export const getMyCompany = async (hrUserId: number) => {
  const company = await prisma.company.findFirst({
    where: { hrUserId },
    include: {
      jobs: {
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: { jobs: true, reviews: true },
      },
    },
  });

  return company;
};

// Create company review
export const createReview = async (userId: number, data: CompanyReviewInput) => {
  // Check if user already reviewed
  const existingReview = await prisma.companyReview.findFirst({
    where: { userId, companyId: data.companyId },
  });

  if (existingReview) {
    throw new Error('Bạn đã đánh giá công ty này');
  }

  const review = await prisma.companyReview.create({
    data: {
      rating: data.rating,
      title: data.title,
      content: data.content,
      pros: data.pros || null,
      cons: data.cons || null,
      isAnonymous: data.isAnonymous || false,
      company: {
        connect: { id: data.companyId },
      },
      user: {
        connect: { id: userId },
      },
    },
    include: {
      user: {
        select: { id: true, Fullname: true, avatar: true },
      },
    },
  });

  return review;
};

// Get company reviews
export const getCompanyReviews = async (companyId: number, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.companyReview.findMany({
      where: { companyId },
      skip,
      take: limit,
      include: {
        user: {
          select: { id: true, Fullname: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.companyReview.count({ where: { companyId } }),
  ]);

  return {
    reviews,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
