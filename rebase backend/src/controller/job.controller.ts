import { Request, Response } from 'express';
import * as jobService from '../service/job.service';
import { createJobPostSchema, updateJobPostSchema, searchJobSchema } from '../validation/job';
import { ZodError } from 'zod';
import { prisma } from '../config/client';

// Create job post
export const createJobPost = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    // Get company of HR user
    const company = await prisma.company.findFirst({
      where: { hrUserId: req.user.id },
    });

    if (!company) {
      res.status(400).json({ success: false, message: 'Bạn chưa có công ty' });
      return;
    }

    const validatedData = createJobPostSchema.parse(req.body);
    const job = await jobService.createJobPost(company.id, validatedData);

    res.status(201).json({
      success: true,
      message: 'Tạo tin tuyển dụng thành công. Đang chờ duyệt.',
      data: job,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: error.errors,
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Tạo tin thất bại',
    });
  }
};

// Get all jobs (public search)
export const getAllJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters = searchJobSchema.parse({
      keyword: req.query.keyword,
      location: req.query.location,
      categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined,
      jobType: req.query.jobType,
      salaryMin: req.query.salaryMin ? parseFloat(req.query.salaryMin as string) : undefined,
      salaryMax: req.query.salaryMax ? parseFloat(req.query.salaryMax as string) : undefined,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
    });

    const result = await jobService.getAllJobPosts(filters);

    res.status(200).json({
      success: true,
      data: result.jobs,
      meta: result.meta,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy danh sách thất bại',
    });
  }
};

// Get job by ID
export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobId = parseInt(req.params.id);
    const job = await jobService.getJobPostById(jobId);

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : 'Không tìm thấy',
    });
  }
};

// Update job post
export const updateJobPost = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const company = await prisma.company.findFirst({
      where: { hrUserId: req.user.id },
    });

    if (!company) {
      res.status(400).json({ success: false, message: 'Bạn chưa có công ty' });
      return;
    }

    const jobId = parseInt(req.params.id);
    const validatedData = updateJobPostSchema.parse(req.body);
    const job = await jobService.updateJobPost(jobId, company.id, validatedData);

    res.status(200).json({
      success: true,
      message: 'Cập nhật tin thành công',
      data: job,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: error.errors,
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Cập nhật thất bại',
    });
  }
};

// Delete job post
export const deleteJobPost = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const company = await prisma.company.findFirst({
      where: { hrUserId: req.user.id },
    });

    if (!company) {
      res.status(400).json({ success: false, message: 'Bạn chưa có công ty' });
      return;
    }

    const jobId = parseInt(req.params.id);
    const result = await jobService.deleteJobPost(jobId, company.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Xóa thất bại',
    });
  }
};

// Toggle job status
export const toggleJobStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const company = await prisma.company.findFirst({
      where: { hrUserId: req.user.id },
    });

    if (!company) {
      res.status(400).json({ success: false, message: 'Bạn chưa có công ty' });
      return;
    }

    const jobId = parseInt(req.params.id);
    const job = await jobService.toggleJobStatus(jobId, company.id);

    res.status(200).json({
      success: true,
      message: job.isActive ? 'Đã bật tin' : 'Đã tắt tin',
      data: job,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Cập nhật thất bại',
    });
  }
};

// Get company jobs (HR)
export const getMyJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const company = await prisma.company.findFirst({
      where: { hrUserId: req.user.id },
    });

    if (!company) {
      res.status(200).json({ success: true, data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await jobService.getCompanyJobs(company.id, page, limit);

    res.status(200).json({
      success: true,
      data: result.jobs,
      meta: result.meta,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy danh sách thất bại',
    });
  }
};

// Approve job (Admin)
export const approveJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobId = parseInt(req.params.id);
    const { isApproved } = req.body;

    const job = await jobService.approveJobPost(jobId, isApproved);

    res.status(200).json({
      success: true,
      message: isApproved ? 'Duyệt tin thành công' : 'Từ chối tin tuyển dụng',
      data: job,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Cập nhật thất bại',
    });
  }
};

// Get pending jobs (Admin)
export const getPendingJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await jobService.getPendingJobs(page, limit);

    res.status(200).json({
      success: true,
      data: result.jobs,
      meta: result.meta,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy danh sách thất bại',
    });
  }
};

// Save job
export const saveJob = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const jobPostId = parseInt(req.params.id);
    const savedJob = await jobService.saveJob(req.user.id, jobPostId);

    res.status(201).json({
      success: true,
      message: 'Lưu tin thành công',
      data: savedJob,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lưu tin thất bại',
    });
  }
};

// Unsave job
export const unsaveJob = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const jobPostId = parseInt(req.params.id);
    const result = await jobService.unsaveJob(req.user.id, jobPostId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Bỏ lưu thất bại',
    });
  }
};

// Get saved jobs
export const getSavedJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await jobService.getSavedJobs(req.user.id, page, limit);

    res.status(200).json({
      success: true,
      data: result.savedJobs,
      meta: result.meta,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy danh sách thất bại',
    });
  }
};
