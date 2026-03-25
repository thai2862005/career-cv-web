import { z } from 'zod';

export const createCVSchema = z.object({
  title: z.string().min(2, 'Tiêu đề CV phải có ít nhất 2 ký tự'),
  isDefault: z.boolean().optional().default(false),
});

export const updateCVSchema = z.object({
  title: z.string().min(2).optional(),
  isDefault: z.boolean().optional(),
});

export type CreateCVInput = z.infer<typeof createCVSchema>;
export type UpdateCVInput = z.infer<typeof updateCVSchema>;
