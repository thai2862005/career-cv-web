import { z } from 'zod';

export const createJobPostSchema = z.object({
  title: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
  description: z.string().min(50, 'Mô tả phải có ít nhất 50 ký tự'),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  location: z.string().min(1, 'Địa điểm không được để trống'),
  salary: z.number().optional(),
  salaryMax: z.number().optional(),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE']).optional(),
  experience: z.string().optional(),
  categoryId: z.number().optional(),
  deadline: z.string().datetime().optional(),
});

export const updateJobPostSchema = createJobPostSchema.partial();

export const searchJobSchema = z.object({
  keyword: z.string().optional(),
  location: z.string().optional(),
  categoryId: z.number().optional(),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE']).optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  page: z.number().default(1),
  limit: z.number().default(10),
});

export const applyJobSchema = z.object({
  jobPostId: z.number(),
  cvId: z.number(),
  coverLetter: z.string().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['PENDING', 'VIEWED', 'ACCEPTED', 'REJECTED']),
  note: z.string().optional(),
});

export type CreateJobPostInput = z.infer<typeof createJobPostSchema>;
export type UpdateJobPostInput = z.infer<typeof updateJobPostSchema>;
export type SearchJobInput = z.infer<typeof searchJobSchema>;
export type ApplyJobInput = z.infer<typeof applyJobSchema>;
