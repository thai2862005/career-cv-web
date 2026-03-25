import { prisma } from '../config/client';
import { CreateCategoryInput, UpdateCategoryInput } from '../validation/category';

// Create category (Admin)
export const createCategory = async (data: CreateCategoryInput) => {
  const existingCategory = await prisma.category.findUnique({
    where: { name: data.name },
  });

  if (existingCategory) {
    throw new Error('Danh mục đã tồn tại');
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      description: data.description || null,
      icon: data.icon || null,
      isActive: data.isActive ?? true,
    },
  });

  return category;
};

// Get all categories
export const getAllCategories = async (includeInactive: boolean = false) => {
  const where = includeInactive ? {} : { isActive: true };

  const categories = await prisma.category.findMany({
    where,
    include: {
      _count: {
        select: { jobs: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  return categories;
};

// Get category by ID
export const getCategoryById = async (categoryId: number) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      jobs: {
        where: { isActive: true, isApproved: true },
        take: 10,
        include: {
          company: {
            select: { id: true, name: true, logoUrl: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: { jobs: true },
      },
    },
  });

  if (!category) {
    throw new Error('Không tìm thấy danh mục');
  }

  return category;
};

// Update category (Admin)
export const updateCategory = async (categoryId: number, data: UpdateCategoryInput) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error('Không tìm thấy danh mục');
  }

  if (data.name && data.name !== category.name) {
    const existingCategory = await prisma.category.findUnique({
      where: { name: data.name },
    });

    if (existingCategory) {
      throw new Error('Tên danh mục đã tồn tại');
    }
  }

  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data,
  });

  return updatedCategory;
};

// Delete category (Admin)
export const deleteCategory = async (categoryId: number) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      _count: {
        select: { jobs: true },
      },
    },
  });

  if (!category) {
    throw new Error('Không tìm thấy danh mục');
  }

  if (category._count.jobs > 0) {
    throw new Error('Không thể xóa danh mục đang có tin tuyển dụng');
  }

  await prisma.category.delete({
    where: { id: categoryId },
  });

  return { message: 'Xóa danh mục thành công' };
};

// Toggle category status (Admin)
export const toggleCategoryStatus = async (categoryId: number) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error('Không tìm thấy danh mục');
  }

  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: { isActive: !category.isActive },
  });

  return updatedCategory;
};
