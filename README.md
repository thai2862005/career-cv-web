# Career CV Web

Repository gốc cho hệ thống Career CV. Dự án được tách thành 2 phần:

- [JobEntry](JobEntry/README.md): frontend React + Vite
- [rebase backend](rebase%20backend/README.md): backend Express + TypeScript + Prisma

## Cấu trúc tổng quan

```text
Career CV Web/
├── JobEntry/         # Ứng dụng frontend
├── rebase backend/   # API backend
└── README.md         # Tài liệu tổng quan này
```

## Cách chạy dự án

1. Chạy backend trước theo hướng dẫn trong [rebase backend/README.md](rebase%20backend/README.md).
2. Đảm bảo backend đang chạy ở `http://localhost:5000` hoặc cập nhật `VITE_API_BASE_URL`.
3. Chạy frontend theo hướng dẫn trong [JobEntry/README.md](JobEntry/README.md).

## Tài liệu chi tiết

- Frontend: [JobEntry/README.md](JobEntry/README.md)
- Backend: [rebase backend/README.md](rebase%20backend/README.md)

## Ghi chú

- Repository gốc này không phải là một ứng dụng chạy trực tiếp.
- Nếu chỉ cần làm việc với giao diện, mở thư mục [JobEntry](JobEntry).
- Nếu chỉ cần làm việc với API, mở thư mục [rebase backend](rebase%20backend).
