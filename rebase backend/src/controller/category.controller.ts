import { Request, Response } from 'express';
import * as categoryService from '../service/category.service';
import { createCategorySchema, updateCategorySchema } from '../validation/category';
import { ZodError } from 'zod';

// Create category (Admin)
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createCategorySchema.parse(req.body);
    const category = await categoryService.createCategory(validatedData);

    res.status(201).json({
      success: true,
      message: 'Tạo danh mục thành công',
      data: category,
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
      message: error instanceof Error ? error.message : 'Tạo danh mục thất bại',
    });
  }
};

// Get all categories
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const categories = await categoryService.getAllCategories(includeInactive);

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy danh sách thất bại',
    });
  }
};

// Get category by ID
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryId = parseInt(req.params.id);
    const category = await categoryService.getCategoryById(categoryId);

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : 'Không tìm thấy',
    });
  }
};

// Update category (Admin)
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryId = parseInt(req.params.id);
    const validatedData = updateCategorySchema.parse(req.body);
    const category = await categoryService.updateCategory(categoryId, validatedData);

    res.status(200).json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      data: category,
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

// Delete category (Admin)
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryId = parseInt(req.params.id);
    const result = await categoryService.deleteCategory(categoryId);

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

// Toggle category status (Admin)
export const toggleCategoryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryId = parseInt(req.params.id);
    const category = await categoryService.toggleCategoryStatus(categoryId);

    res.status(200).json({
      success: true,
      message: category.isActive ? 'Đã bật danh mục' : 'Đã tắt danh mục',
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Cập nhật thất bại',
    });
  }
};
