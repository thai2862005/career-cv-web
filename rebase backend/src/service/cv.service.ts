import { prisma } from '../config/client';
import { CreateCVInput, UpdateCVInput } from '../validation/cv';

// Create CV
export const createCV = async (
  userId: number,
  data: CreateCVInput,
  file: { filename: string; path: string; size: number }
) => {
  // If setting as default, unset other defaults
  if (data.isDefault) {
    await prisma.cV.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  const cv = await prisma.cV.create({
    data: {
      userId,
      title: data.title,
      filename: file.filename,
      fileUrl: file.path,
      fileSize: file.size,
      isDefault: data.isDefault,
    },
  });

  return cv;
};

// Get all CVs of a user
export const getUserCVs = async (userId: number) => {
  const cvs = await prisma.cV.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return cvs;
};

// Get CV by ID
export const getCVById = async (cvId: number, userId: number) => {
  const cv = await prisma.cV.findFirst({
    where: { id: cvId, userId },
  });

  if (!cv) {
    throw new Error('Không tìm thấy CV');
  }

  return cv;
};

// Update CV
export const updateCV = async (cvId: number, userId: number, data: UpdateCVInput) => {
  const cv = await prisma.cV.findFirst({
    where: { id: cvId, userId },
  });

  if (!cv) {
    throw new Error('Không tìm thấy CV');
  }

  // If setting as default, unset other defaults
  if (data.isDefault) {
    await prisma.cV.updateMany({
      where: { userId, isDefault: true, id: { not: cvId } },
      data: { isDefault: false },
    });
  }

  const updatedCV = await prisma.cV.update({
    where: { id: cvId },
    data,
  });

  return updatedCV;
};

// Delete CV
export const deleteCV = async (cvId: number, userId: number) => {
  const cv = await prisma.cV.findFirst({
    where: { id: cvId, userId },
  });

  if (!cv) {
    throw new Error('Không tìm thấy CV');
  }

  // Check if CV is used in any application
  const applications = await prisma.jobApplication.findFirst({
    where: { cvId },
  });

  if (applications) {
    throw new Error('Không thể xóa CV đang được sử dụng trong đơn ứng tuyển');
  }

  await prisma.cV.delete({
    where: { id: cvId },
  });

  return { message: 'Xóa CV thành công' };
};

// Set default CV
export const setDefaultCV = async (cvId: number, userId: number) => {
  const cv = await prisma.cV.findFirst({
    where: { id: cvId, userId },
  });

  if (!cv) {
    throw new Error('Không tìm thấy CV');
  }

  // Unset other defaults
  await prisma.cV.updateMany({
    where: { userId, isDefault: true },
    data: { isDefault: false },
  });

  // Set this as default
  const updatedCV = await prisma.cV.update({
    where: { id: cvId },
    data: { isDefault: true },
  });

  return updatedCV;
};
