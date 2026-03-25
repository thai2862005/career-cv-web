import { Request, Response } from 'express';
import * as cvService from '../service/cv.service';
import { createCVSchema, updateCVSchema } from '../validation/cv';
import { ZodError } from 'zod';

// Upload CV
export const uploadCV = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ success: false, message: 'Vui lòng tải lên file CV' });
      return;
    }

    const validatedData = createCVSchema.parse(req.body);
    const cv = await cvService.createCV(req.user.id, validatedData, {
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
    });

    res.status(201).json({
      success: true,
      message: 'Tải lên CV thành công',
      data: cv,
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
      message: error instanceof Error ? error.message : 'Tải lên thất bại',
    });
  }
};

// Get my CVs
export const getMyCVs = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const cvs = await cvService.getUserCVs(req.user.id);

    res.status(200).json({
      success: true,
      data: cvs,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy danh sách CV thất bại',
    });
  }
};

// Get CV by ID
export const getCVById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const cvId = parseInt(req.params.id);
    const cv = await cvService.getCVById(cvId, req.user.id);

    res.status(200).json({
      success: true,
      data: cv,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy CV thất bại',
    });
  }
};

// Update CV
export const updateCV = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const cvId = parseInt(req.params.id);
    const validatedData = updateCVSchema.parse(req.body);
    const cv = await cvService.updateCV(cvId, req.user.id, validatedData);

    res.status(200).json({
      success: true,
      message: 'Cập nhật CV thành công',
      data: cv,
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

// Delete CV
export const deleteCV = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const cvId = parseInt(req.params.id);
    const result = await cvService.deleteCV(cvId, req.user.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Xóa CV thất bại',
    });
  }
};

// Set default CV
export const setDefaultCV = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    const cvId = parseInt(req.params.id);
    const cv = await cvService.setDefaultCV(cvId, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Đặt CV mặc định thành công',
      data: cv,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Cập nhật thất bại',
    });
  }
};
