# Career CV Backend API

Backend của hệ thống tuyển dụng Career CV. Dự án hỗ trợ 3 nhóm người dùng chính: Job Seeker, HR và Admin.

## Tổng quan

API được xây bằng Express + TypeScript, dùng Prisma kết nối MySQL, xác thực bằng JWT và hỗ trợ upload CV, avatar, logo. File upload được phục vụ trực tiếp qua thư mục `/uploads`.

## Yêu cầu môi trường

- Node.js 18+.
- MySQL.
- Tài khoản SMTP nếu muốn gửi email.

## Cài đặt

```bash
npm install

copy .env.example .env
# Chỉnh DATABASE_URL, JWT và SMTP theo môi trường của bạn

npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

## Biến môi trường

Tạo file `.env` từ `.env.example` rồi cập nhật các giá trị sau:

| Biến                     | Mô tả                             |
| ------------------------ | --------------------------------- |
| `DATABASE_URL`           | Chuỗi kết nối MySQL cho Prisma    |
| `JWT_SECRET`             | Secret ký access token            |
| `JWT_EXPIRES_IN`         | Thời gian hết hạn access token    |
| `JWT_REFRESH_EXPIRES_IN` | Thời gian hết hạn refresh token   |
| `PORT`                   | Cổng chạy server, mặc định `5000` |
| `NODE_ENV`               | `development` hoặc `production`   |
| `SMTP_HOST`              | SMTP server                       |
| `SMTP_PORT`              | Cổng SMTP                         |
| `SMTP_SECURE`            | `true` hoặc `false`               |
| `SMTP_USER`              | Email gửi đi                      |
| `SMTP_PASS`              | Mật khẩu ứng dụng / app password  |
| `SMTP_FROM`              | Địa chỉ người gửi mặc định        |

## Scripts

```bash
npm run dev          # Chạy backend ở chế độ development
npm run build        # Compile TypeScript
npm run db:migrate   # Tạo và áp migration Prisma
npm run db:push      # Đẩy schema trực tiếp lên DB
npm run db:seed      # Seed dữ liệu mẫu
npm run db:studio    # Mở Prisma Studio
npm run db:generate  # Sinh Prisma Client
```

## Tài khoản mẫu

Sau khi seed, hệ thống tạo sẵn:

- Admin: `admin@career-cv.com` / `admin123`
- Một số tài khoản HR mẫu trong file seed, cùng mật khẩu `admin123`

## API chính

Base path: `/api/v1`

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/profile`
- `PUT /auth/profile`
- `PUT /auth/change-password`

### CV

- `POST /cv` để upload CV, field file là `file`
- `GET /cv`
- `GET /cv/:id`
- `PUT /cv/:id`
- `DELETE /cv/:id`
- `PUT /cv/:id/default`

### Companies

- `GET /companies`
- `GET /companies/:id`
- `GET /companies/:id/reviews`
- `POST /companies` cho HR
- `PUT /companies/:id` cho HR
- `GET /hr/company`
- `POST /companies/reviews`

### Jobs

- `GET /jobs`
- `GET /jobs/:id`
- `POST /jobs/:id/save`
- `DELETE /jobs/:id/save`
- `GET /saved-jobs`
- `POST /hr/jobs`
- `GET /hr/jobs`
- `PUT /hr/jobs/:id`
- `DELETE /hr/jobs/:id`
- `PUT /hr/jobs/:id/toggle`

### Applications

- `POST /applications`
- `GET /applications`
- `GET /applications/:id`
- `DELETE /applications/:id`
- `GET /hr/applications`
- `GET /hr/applications/stats`
- `GET /hr/jobs/:jobId/applications`
- `PUT /hr/applications/:id/status`
- `GET /hr/candidates`

### Notifications, messages, email, categories, admin

- `GET /notifications`
- `PUT /notifications/:id/read`
- `PUT /notifications/read-all`
- `DELETE /notifications/:id`
- `GET /messages`, `POST /messages`
- `POST /contact`
- `GET /email/history`
- `GET /categories`, `GET /categories/:id`
- Các route `admin/*` cho dashboard, users, companies, jobs, categories, reports và contacts

## Response format

```json
{
  "success": true,
  "message": "Thông báo",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## Xác thực

Gửi JWT trong header:

```http
Authorization: Bearer <token>
```

## Upload file

- CV: lưu tại `uploads/cv`
- Avatar: lưu tại `uploads/avatar`
- Logo công ty: lưu tại `uploads/logo`

Các file upload có thể truy cập qua URL công khai bắt đầu bằng `/uploads`.

## Cấu trúc thư mục

```text
src/
├── app.ts
├── config/
├── controller/
├── middleware/
├── routers/
├── service/
├── type/
└── validation/

prisma/
├── schema.prisma
├── seed.ts
└── migrations/
```

## Kiểm tra nhanh

- `GET /health` để kiểm tra server có chạy hay không.
- Khi chạy local, server mặc định ở `http://localhost:5000`.
