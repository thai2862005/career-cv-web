import { Request, Response } from 'express';
import { CreateUser, DeleteUser, GetAllUsers, GetUserById, UpdateUser } from '../../service/user/user.services';
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatar: z.string().optional(),
  roleId: z.string().optional().default('1'),
});

const updateUserSchema = z.object({
  Fullname: z.string().min(2).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatar: z.string().optional(),
});

// Create user
const CreateUSerApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, address, email, password, avatar, roleId } = createUserSchema.parse(req.body);
    const user = await CreateUser(
      name,
      phone || '',
      address || '',
      email,
      password,
      avatar || '',
      roleId
    );

    res.status(201).json({
      success: true,
      message: 'Tạo người dùng thành công',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Tạo người dùng thất bại',
    });
  }
};

// Get all users
const GetAllUsersApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await GetAllUsers(page, limit);

    res.status(200).json({
      success: true,
      data: result.users,
      meta: result.meta,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lấy danh sách thất bại',
    });
  }
};

// Delete user
const DeleteUserApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await DeleteUser(+id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Xóa người dùng thất bại',
    });
  }
};

// Get user by ID
const GetUserByIdApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await GetUserById(+id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : 'Không tìm thấy người dùng',
    });
  }
};

// Update user
const UpdateUserApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = updateUserSchema.parse(req.body);
    const user = await UpdateUser(+id, data);

    res.status(200).json({
      success: true,
      message: 'Cập nhật thành công',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Cập nhật thất bại',
    });
  }
};

export { CreateUSerApi, GetAllUsersApi, DeleteUserApi, GetUserByIdApi, UpdateUserApi };