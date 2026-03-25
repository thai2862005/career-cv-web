import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        roleId: number;
        roleName: string;
      };
    }
  }
}

export interface JwtPayload {
  id: number;
  email: string;
  roleId: number;
  roleName: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface SearchFilters {
  keyword?: string;
  location?: string;
  categoryId?: number;
  jobType?: string;
  salaryMin?: number;
  salaryMax?: number;
}

export {};
