# Career CV - Backend API

Hệ thống tuyển dụng việc làm với 3 loại người dùng: Người tìm việc, Nhà tuyển dụng (HR), và Admin.

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Copy file .env
cp .env.example .env
# Cấu hình DATABASE_URL và các biến môi trường khác

# Chạy migration
npm run db:migrate

# Seed dữ liệu mẫu (roles, categories, admin user)
npm run db:seed

# Chạy server development
npm run dev
```

## Tài khoản mặc định

- **Admin**: admin@career-cv.com / admin123

## API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/auth/register` | Đăng ký tài khoản | - |
| POST | `/auth/login` | Đăng nhập | - |
| GET | `/auth/profile` | Lấy thông tin cá nhân | ✓ |
| PUT | `/auth/profile` | Cập nhật thông tin | ✓ |
| PUT | `/auth/change-password` | Đổi mật khẩu | ✓ |

### CV (`/api/v1/cv`) - Job Seeker

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/cv` | Upload CV (multipart/form-data) | ✓ |
| GET | `/cv` | Lấy danh sách CV của tôi | ✓ |
| GET | `/cv/:id` | Lấy chi tiết CV | ✓ |
| PUT | `/cv/:id` | Cập nhật CV | ✓ |
| DELETE | `/cv/:id` | Xóa CV | ✓ |
| PUT | `/cv/:id/default` | Đặt CV mặc định | ✓ |

### Company (`/api/v1/companies`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/companies` | Danh sách công ty | - |
| GET | `/companies/:id` | Chi tiết công ty | - |
| GET | `/companies/:id/reviews` | Đánh giá công ty | - |
| POST | `/companies` | Tạo công ty (HR) | ✓ HR |
| PUT | `/companies/:id` | Cập nhật công ty | ✓ HR |
| GET | `/hr/company` | Lấy công ty của tôi (HR) | ✓ HR |
| POST | `/companies/reviews` | Đánh giá công ty | ✓ Job Seeker |

### Jobs (`/api/v1/jobs`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/jobs` | Tìm kiếm việc làm | - |
| GET | `/jobs/:id` | Chi tiết tin tuyển dụng | - |
| POST | `/jobs/:id/save` | Lưu tin tuyển dụng | ✓ Job Seeker |
| DELETE | `/jobs/:id/save` | Bỏ lưu tin | ✓ Job Seeker |
| GET | `/saved-jobs` | Danh sách tin đã lưu | ✓ Job Seeker |

### HR Jobs (`/api/v1/hr/jobs`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/hr/jobs` | Đăng tin tuyển dụng | ✓ HR |
| GET | `/hr/jobs` | Danh sách tin của tôi | ✓ HR |
| PUT | `/hr/jobs/:id` | Cập nhật tin | ✓ HR |
| DELETE | `/hr/jobs/:id` | Xóa tin | ✓ HR |
| PUT | `/hr/jobs/:id/toggle` | Bật/tắt tin | ✓ HR |

### Applications (`/api/v1/applications`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/applications` | Ứng tuyển công việc | ✓ Job Seeker |
| GET | `/applications` | Danh sách đơn ứng tuyển | ✓ Job Seeker |
| GET | `/applications/:id` | Chi tiết đơn | ✓ |
| DELETE | `/applications/:id` | Hủy đơn ứng tuyển | ✓ Job Seeker |

### HR Applications (`/api/v1/hr`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/hr/applications` | Tất cả đơn ứng tuyển | ✓ HR |
| GET | `/hr/applications/stats` | Thống kê đơn | ✓ HR |
| GET | `/hr/jobs/:jobId/applications` | Đơn theo tin tuyển dụng | ✓ HR |
| PUT | `/hr/applications/:id/status` | Cập nhật trạng thái | ✓ HR |
| GET | `/hr/candidates` | Tìm kiếm ứng viên | ✓ HR |

### Notifications (`/api/v1/notifications`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/notifications` | Danh sách thông báo | ✓ |
| PUT | `/notifications/:id/read` | Đánh dấu đã đọc | ✓ |
| PUT | `/notifications/read-all` | Đánh dấu tất cả đã đọc | ✓ |
| DELETE | `/notifications/:id` | Xóa thông báo | ✓ |

### Categories (`/api/v1/categories`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/categories` | Danh sách danh mục | - |
| GET | `/categories/:id` | Chi tiết danh mục | - |

### Admin (`/api/v1/admin`) - Admin Only

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/admin/dashboard` | Thống kê tổng quan |
| GET | `/admin/users` | Danh sách người dùng |
| GET | `/admin/users/:id` | Chi tiết người dùng |
| PUT | `/admin/users/:id` | Cập nhật người dùng |
| PUT | `/admin/users/:id/toggle` | Khóa/mở khóa tài khoản |
| DELETE | `/admin/users/:id` | Xóa người dùng |
| PUT | `/admin/users/:id/reset-password` | Reset mật khẩu |
| GET | `/admin/roles` | Danh sách roles |
| GET | `/admin/reports` | Báo cáo hệ thống |
| GET | `/admin/companies` | Quản lý công ty |
| PUT | `/admin/companies/:id/verify` | Xác minh công ty |
| GET | `/admin/jobs/pending` | Tin chờ duyệt |
| PUT | `/admin/jobs/:id/approve` | Duyệt/từ chối tin |
| POST | `/admin/categories` | Tạo danh mục |
| PUT | `/admin/categories/:id` | Cập nhật danh mục |
| DELETE | `/admin/categories/:id` | Xóa danh mục |
| GET | `/admin/contacts` | Danh sách liên hệ |
| PUT | `/admin/contacts/:id/resolve` | Đánh dấu đã xử lý |

### Contact (`/api/v1/contact`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/contact` | Gửi liên hệ | - |

## Roles & Permissions

| Role | ID | Mô tả |
|------|-----|-------|
| job_seeker | 1 | Người tìm việc |
| hr | 2 | Nhà tuyển dụng |
| admin | 3 | Quản trị viên |

## Response Format

```json
{
  "success": true,
  "message": "Thông báo",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## Authentication

Sử dụng JWT Bearer Token trong header:

```
Authorization: Bearer <token>
```

## Scripts

```bash
npm run dev          # Chạy development server
npm run build        # Build TypeScript
npm run db:migrate   # Chạy Prisma migration
npm run db:push      # Push schema to DB
npm run db:seed      # Seed dữ liệu mẫu
npm run db:studio    # Mở Prisma Studio
npm run db:generate  # Generate Prisma client
```

## Cấu trúc thư mục

```
src/
├── app.ts              # Entry point
├── config/             # Cấu hình (auth, multer, prisma client)
├── controller/         # Controllers
├── middleware/         # Middleware (auth)
├── routers/           # Routes
├── service/           # Business logic
├── type/              # TypeScript types
└── validation/        # Zod schemas

prisma/
├── schema.prisma      # Database schema
├── seed.ts            # Seed script
└── migrations/        # Migration files
```
