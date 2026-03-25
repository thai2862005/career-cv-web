import { Request, Response } from 'express';
import * as companyService from '../service/company.service';
import { createCompanySchema, updateCompanySchema, companyReviewSchema } from '../validation/company';
import { ZodError } from 'zod';

// Create company
export const createCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const validatedData = createCompanySchema.parse(req.body);
    const company = await companyService.createCompany(req.user.id, validatedData);

    res.status(201).json({
      success: true,
      message: 'Tạo công ty thành công',
      data: company,
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
      message: error instanceof Error ? error.message : 'Tạo công ty thất bại',
    });
  }
};

// Get all companies
export const getAllCompanies = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await companyService.getAllCompanies(page, limit);

    res.status(200).json({
      success: true,
      data: result.companies,
      meta: result.meta,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy danh sách thất bại',
    });
  }
};

// Get company by ID
export const getCompanyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = parseInt(req.params.id);
    const company = await companyService.getCompanyById(companyId);

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : 'Không tìm thấy công ty',
    });
  }
};

// Update company
export const updateCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const companyId = parseInt(req.params.id);
    const validatedData = updateCompanySchema.parse(req.body);
    const company = await companyService.updateCompany(companyId, req.user.id, validatedData);

    res.status(200).json({
      success: true,
      message: 'Cập nhật công ty thành công',
      data: company,
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

// Delete company (Admin)
export const deleteCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = parseInt(req.params.id);
    const result = await companyService.deleteCompany(companyId);

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

// Verify company (Admin)
export const verifyCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = parseInt(req.params.id);
    const { isVerified } = req.body;

    const company = await companyService.verifyCompany(companyId, isVerified);

    res.status(200).json({
      success: true,
      message: isVerified ? 'Xác minh công ty thành công' : 'Đã hủy xác minh công ty',
      data: company,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Cập nhật thất bại',
    });
  }
};

// Get my company
export const getMyCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const company = await companyService.getMyCompany(req.user.id);

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy thông tin thất bại',
    });
  }
};

// Create review
export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const validatedData = companyReviewSchema.parse(req.body);
    const review = await companyService.createReview(req.user.id, validatedData);

    res.status(201).json({
      success: true,
      message: 'Đánh giá thành công',
      data: review,
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
      message: error instanceof Error ? error.message : 'Đánh giá thất bại',
    });
  }
};

// Get company reviews
export const getCompanyReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = parseInt(req.params.id);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await companyService.getCompanyReviews(companyId, page, limit);

    res.status(200).json({
      success: true,
      data: result.reviews,
      meta: result.meta,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy đánh giá thất bại',
    });
  }
};
