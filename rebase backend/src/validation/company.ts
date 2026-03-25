import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string().min(2, 'Tên công ty phải có ít nhất 2 ký tự'),
  description: z.string().min(20, 'Mô tả phải có ít nhất 20 ký tự'),
  location: z.string().min(1, 'Địa điểm không được để trống'),
  website: z.string().url().optional().or(z.literal('')),
  logoUrl: z.string().optional(),
  coverImage: z.string().optional(),
  size: z.string().optional(),
  industry: z.string().optional(),
});

export const updateCompanySchema = createCompanySchema.partial();

export const companyReviewSchema = z.object({
  companyId: z.number(),
  rating: z.number().min(1).max(5),
  title: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
  content: z.string().min(20, 'Nội dung phải có ít nhất 20 ký tự'),
  pros: z.string().optional(),
  cons: z.string().optional(),
  isAnonymous: z.boolean().optional().default(false),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type CompanyReviewInput = z.infer<typeof companyReviewSchema>;
