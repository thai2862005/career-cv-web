import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadConfig } from './auth';

// Ensure directories exist
const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// CV upload storage
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../', uploadConfig.uploadDir);
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'cv-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Avatar upload storage
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../', uploadConfig.avatarDir);
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Logo upload storage
const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../', uploadConfig.logoDir);
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for CV
const cvFileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (uploadConfig.allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file PDF hoặc Word'));
  }
};

// File filter for images
const imageFileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)'));
  }
};

// CV upload middleware
export const uploadCV = multer({
  storage: cvStorage,
  limits: {
    fileSize: uploadConfig.maxFileSize,
  },
  fileFilter: cvFileFilter,
});

// Avatar upload middleware
export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: imageFileFilter,
});

// Logo upload middleware
export const uploadLogo = multer({
  storage: logoStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: imageFileFilter,
});
