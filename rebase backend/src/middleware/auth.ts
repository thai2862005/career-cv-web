import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig, ROLES } from '../config/auth';
import { JwtPayload } from '../type';

// Verify JWT Token
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Không có token xác thực' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, authConfig.jwtSecret) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, authConfig.jwtSecret) as JwtPayload;
      req.user = decoded;
    }
    next();
  } catch {
    next();
  }
};

// Role-based authorization
export const authorize = (...allowedRoles: number[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
      return;
    }

    if (!allowedRoles.includes(req.user.roleId)) {
      res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
      return;
    }

    next();
  };
};

// Shorthand middleware
export const isJobSeeker = authorize(ROLES.JOB_SEEKER, ROLES.ADMIN);
export const isHR = authorize(ROLES.HR, ROLES.ADMIN);
export const isAdmin = authorize(ROLES.ADMIN);
export const isHROrAdmin = authorize(ROLES.HR, ROLES.ADMIN);
