import { Request, Response } from 'express';
import * as applicationService from '../service/application.service';
import { applyJobSchema, updateApplicationStatusSchema } from '../validation/job';
import { ZodError } from 'zod';
import { prisma } from '../config/client';
import { ApplyStatus } from '@prisma/client';

// Apply for job
export const applyForJob = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const validatedData = applyJobSchema.parse(req.body);
    const application = await applicationService.applyForJob(req.user.id, validatedData);

    res.status(201).json({
      success: true,
      message: 'Ứng tuyển thành công',
      data: application,
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
      message: error instanceof Error ? error.message : 'Ứng tuyển thất bại',
    });
  }
};

// Get my applications
export const getMyApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await applicationService.getUserApplications(req.user.id, page, limit);

    res.status(200).json({
      success: true,
      data: result.applications,
      meta: result.meta,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy danh sách thất bại',
    });
  }
};

// Get application by ID
export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const applicationId = parseInt(req.params.id);
    const application = await applicationService.getApplicationById(applicationId, req.user.id);

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : 'Không tìm thấy',
    });
  }
};

// Cancel application
export const cancelApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const applicationId = parseInt(req.params.id);
    const result = await applicationService.cancelApplication(applicationId, req.user.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Hủy đơn thất bại',
    });
  }
};

// Get job applications (HR)
export const getJobApplications = async (req: Request, res: Response): Promise<void> => {
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

    const jobPostId = parseInt(req.params.jobId);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as ApplyStatus | undefined;

    const result = await applicationService.getJobApplications(jobPostId, company.id, page, limit, status);

    res.status(200).json({
      success: true,
      data: result.applications,
      meta: result.meta,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy danh sách thất bại',
    });
  }
};

// Update application status (HR)
export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
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

    const applicationId = parseInt(req.params.id);
    const validatedData = updateApplicationStatusSchema.parse(req.body);

    const application = await applicationService.updateApplicationStatus(
      applicationId,
      company.id,
      validatedData.status as ApplyStatus,
      validatedData.note
    );

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      data: application,
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

// Get all company applications (HR)
export const getCompanyApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const company = await prisma.company.findFirst({
      where: { hrUserId: req.user.id },
    });

    if (!company) {
      res.status(200).json({
        success: true,
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as ApplyStatus | undefined;

    const result = await applicationService.getCompanyApplications(company.id, page, limit, status);

    res.status(200).json({
      success: true,
      data: result.applications,
      meta: result.meta,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy danh sách thất bại',
    });
  }
};

// Get application stats (HR)
export const getApplicationStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const company = await prisma.company.findFirst({
      where: { hrUserId: req.user.id },
    });

    if (!company) {
      res.status(200).json({
        success: true,
        data: { total: 0, byStatus: {} },
      });
      return;
    }

    const stats = await applicationService.getApplicationStats(company.id);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy thống kê thất bại',
    });
  }
};

// Search candidates (HR)
export const searchCandidates = async (req: Request, res: Response): Promise<void> => {
  try {
    const keyword = req.query.keyword as string || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await applicationService.searchCandidates(keyword, page, limit);

    res.status(200).json({
      success: true,
      data: result.candidates,
      meta: result.meta,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Tìm kiếm thất bại',
    });
  }
};
