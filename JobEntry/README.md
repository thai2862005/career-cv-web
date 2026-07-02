# JobEntry Frontend

Giao diện web cho hệ thống Career CV. Ứng dụng được xây bằng React + Vite, hỗ trợ 3 vai trò chính: Candidate, HR và Admin.

## Tính năng chính

- Trang public: trang chủ, danh sách việc làm, chi tiết việc, danh sách công ty.
- Xác thực người dùng: đăng nhập, đăng ký.
- Candidate dashboard: quản lý CV, đơn ứng tuyển, việc đã lưu.
- HR dashboard: quản lý tin tuyển dụng, tìm ứng viên, phỏng vấn.
- Admin dashboard: quản lý người dùng và duyệt tin tuyển dụng.

## Yêu cầu môi trường

- Node.js 18+.
- Backend Career CV API đang chạy.

## Cài đặt

```bash
npm install

copy .env.example .env
# Cấu hình VITE_API_BASE_URL nếu backend không chạy ở localhost:5000

npm run dev
```

## Biến môi trường

Frontend hiện dùng biến sau:

| Biến                | Mô tả                                                    |
| ------------------- | -------------------------------------------------------- |
| `VITE_API_BASE_URL` | URL backend API, mặc định `http://localhost:5000/api/v1` |

## Scripts

```bash
npm run dev      # Chạy Vite dev server
npm run build    # Build production
npm run lint     # Chạy ESLint
npm run preview  # Xem bản build local
```

## Chạy cùng backend

1. Khởi động backend Career CV trước.
2. Đảm bảo backend có thể truy cập tại `http://localhost:5000` hoặc cập nhật `VITE_API_BASE_URL`.
3. Chạy frontend bằng `npm run dev`.

## Cấu trúc thư mục

```text
src/
├── admin/          # Trang quản trị
├── candidate/      # Trang ứng viên
├── components/     # UI dùng chung
├── context/        # Auth context
├── hooks/          # Custom hooks
├── hr/             # Trang HR
├── layout/         # Layout dùng chung
├── services/       # Gọi API backend
└── App.jsx         # Router chính
```

## Router chính

- Public: `/`, `/jobs`, `/jobs/:id`, `/companies`
- Auth: `/login`, `/register`
- Candidate: `/candidate/*`
- HR: `/hr/*`
- Admin: `/admin/*`

## Ghi chú API

Frontend gọi backend qua file [src/services/api.js](src/services/api.js). Mặc định base URL là `http://localhost:5000/api/v1`, nên nếu backend đổi cổng hoặc domain thì chỉ cần cập nhật `VITE_API_BASE_URL`.
