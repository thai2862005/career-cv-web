# Hướng Dẫn Nhanh - Tích Hợp Frontend & Backend

## Bước 1: Cài Đặt Backend

```bash
# Đi vào thư mục backend
cd "rebase backend"

# Cài đặt dependencies
npm install

# Cấu hình database (chọn 1)
npm run db:push              # Đồng bộ schema với database
# HOẶC
npm run db:migrate           # Tạo migrations

# Tuỳ chọn: Thêm dữ liệu mẫu
npm run db:seed

# Khởi động backend
npm run dev
```

**Kết quả mong đợi:**
```
✅ Server is running on http://localhost:5000
📚 API Docs: http://localhost:5000/api/v1
```

---

## Bước 2: Cài Đặt Frontend

```bash
# Đi vào thư mục frontend
cd JobEntry

# Cài đặt dependencies
npm install

# Khởi động development server
npm run dev
```

**Kết quả mong đợi:**
```
  VITE v8.0.9  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## Bước 3: Kiểm Tra Tích Hợp

### Kiểm Tra 1: Health Check Backend
```bash
curl http://localhost:5000/health
```

Kết quả dự kiến:
```json
{
  "status": "OK",
  "timestamp": "2024-04-22T..."
}
```

### Kiểm Tra 2: Xem Jobs từ Frontend
1. Mở http://localhost:5173 trên trình duyệt
2. Vào trang Home
3. Phải thấy phần "Featured Jobs" tải dữ liệu từ backend
4. Mở DevTools (F12) → Network tab
5. Phải thấy request đến `http://localhost:5000/api/v1/jobs`

### Kiểm Tra 3: Đăng Nhập/Đăng Ký
1. Nhấp vào nút "Sign In" hoặc "Create Account"
2. Thử đăng ký hoặc đăng nhập
3. Phải thấy API call ở Network tab
4. Kiểm tra DevTools Console có lỗi gì không

---

## Các Lệnh Thường Dùng

### Backend
```bash
cd "rebase backend"
npm run dev               # Khởi động server
npm run db:push          # Đồng bộ database
npm run db:studio        # Mở trình xem database
npm run db:seed          # Thêm dữ liệu mẫu
npm run build            # Build TypeScript
```

### Frontend
```bash
cd JobEntry
npm run dev              # Khởi động dev server
npm run build            # Build cho production
npm run preview          # Xem preview production
npm run lint             # Kiểm tra code quality
```

---

## Biến Môi Trường

### Backend `.env` (rebase backend/.env)
```
DATABASE_URL=...         # Kết nối database
PORT=5000               # Port server
NODE_ENV=development    # Môi trường
JWT_SECRET=...          # JWT secret key
```

### Frontend `.env` (JobEntry/.env)
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Career CV Portal
```

---

## Xử Lý Sự Cố

### Backend không khởi động?
```bash
# Kiểm tra port 5000 đang dùng
netstat -ano | findstr :5000
# Tắt process: taskkill /PID <PID> /F

# Khởi động lại
npm run dev
```

### "Cannot connect to backend"?
1. **Kiểm tra backend đang chạy** - xem output terminal
2. **Kiểm tra file .env:**
   ```bash
   type JobEntry\.env
   # Phải có: VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```
3. **Kiểm tra CORS** - phải enable trong `rebase backend/src/app.ts`

### Frontend hiển thị "No jobs available"
1. Kiểm tra backend đang chạy
2. Kiểm tra database có dữ liệu:
   ```bash
   cd "rebase backend"
   npm run db:studio
   ```
3. Kiểm tra API call ở DevTools Network tab
4. Tìm lỗi (4xx hoặc 5xx responses)

### Lỗi Token/Authentication
1. **Xoá localStorage:**
   ```javascript
   // Trong DevTools Console:
   localStorage.clear()
   ```
2. **Reload page** và thử đăng nhập lại
3. **Kiểm tra backend logs** để tìm lỗi authentication

---

## Cấu Trúc Dự Án

```
career-cv-web/
├── JobEntry/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js          # API client (MỚI)
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Auth provider (MỚI)
│   │   ├── hooks/
│   │   │   ├── useJobs.js      # Job hooks (MỚI)
│   │   │   └── useCompanies.js # Company hooks (MỚI)
│   │   ├── candidate/
│   │   │   ├── Home.jsx        # Đã cập nhật với API
│   │   │   ├── JobList.jsx     # CẦN cập nhật
│   │   │   └── ...
│   │   ├── App.jsx             # Đã cập nhật AuthProvider
│   │   └── ...
│   ├── .env                    # API config (MỚI)
│   ├── QUICK_START.md          # Hướng dẫn nhanh
│   ├── INTEGRATION_GUIDE.md    # Hướng dẫn đầy đủ
│   └── ...
│
└── rebase backend/              # Backend (Express + TypeScript)
    ├── src/
    │   ├── app.ts              # Express server (CORS enabled)
    │   ├── routers/
    │   │   └── api.ts          # Tất cả API routes
    │   ├── controller/         # Route controllers
    │   ├── service/            # Business logic
    │   └── ...
    ├── .env                    # Backend config
    ├── prisma/
    │   ├── schema.prisma       # Database schema
    │   └── seed.ts             # Dữ liệu mẫu
    └── package.json
```

---

## Ví Dụ Sử Dụng API

### Ví Dụ 1: Component Danh Sách Jobs
```jsx
import { useJobs } from '../hooks/useJobs';
import { Loader } from 'lucide-react';

function JobList() {
  const { jobs, loading, error } = useJobs();

  if (loading) return <Loader className="animate-spin" />;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      {jobs.map(job => (
        <div key={job.id}>
          <h3>{job.title}</h3>
          <p>{job.company.name}</p>
          <p>{job.location}</p>
        </div>
      ))}
    </div>
  );
}
```

### Ví Dụ 2: Form Đăng Nhập
```jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login({ email, password });
    if (!result.success) {
      alert(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mật khẩu"
      />
      <button disabled={loading}>
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  );
}
```

### Ví Dụ 3: Lưu Job
```jsx
import { useSavedJobs } from '../hooks/useJobs';
import { Heart } from 'lucide-react';

function JobCard({ jobId }) {
  const { saveJob, unsaveJob } = useSavedJobs();
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleSave = async () => {
    if (isSaved) {
      await unsaveJob(jobId);
    } else {
      await saveJob(jobId);
    }
    setIsSaved(!isSaved);
  };

  return (
    <button onClick={handleToggleSave}>
      <Heart fill={isSaved ? 'red' : 'none'} />
    </button>
  );
}
```

---

## API Endpoints Chính

### Authentication
```
POST   /auth/register           - Đăng ký user mới
POST   /auth/login              - Đăng nhập
GET    /auth/profile            - Lấy profile (cần auth)
PUT    /auth/profile            - Cập nhật profile (cần auth)
PUT    /auth/change-password    - Đổi mật khẩu (cần auth)
```

### Jobs
```
GET    /jobs                    - Lấy tất cả jobs
GET    /jobs/:id                - Lấy job by ID
POST   /jobs/:id/save           - Lưu job (cần auth)
DELETE /jobs/:id/save           - Bỏ lưu job (cần auth)
GET    /saved-jobs              - Lấy jobs đã lưu (cần auth)
POST   /hr/jobs                 - Tạo job (HR only)
GET    /hr/jobs                 - Lấy jobs của HR
PUT    /hr/jobs/:id             - Cập nhật job (HR only)
DELETE /hr/jobs/:id             - Xoá job (HR only)
```

### Companies
```
GET    /companies               - Lấy tất cả companies
GET    /companies/:id           - Lấy company by ID
GET    /companies/:id/reviews   - Lấy reviews công ty
POST   /companies               - Tạo company (HR only)
GET    /hr/company              - Lấy company của HR
PUT    /companies/:id           - Cập nhật company (HR only)
```

Danh sách đầy đủ xem ở **INTEGRATION_GUIDE.md**

---

## Các Bước Tiếp Theo

### Ngay Lập Tức (Cao ưu tiên)
- [ ] Test cả 2 server chạy cùng lúc
- [ ] Kiểm tra trang Home tải jobs từ backend
- [ ] Thử đăng nhập/đăng ký
- [ ] Cập nhật JobList.jsx (xem JobList-EXAMPLE.jsx)
- [ ] Cập nhật JobDetail.jsx để fetch single job

### Ngắn Hạn (1-2 tuần)
- [ ] Thêm search/filter jobs
- [ ] Tính năng apply job
- [ ] Upload CV
- [ ] Save/Unsave job
- [ ] Notifications

### Trung Hạn (2-4 tuần)
- [ ] HR Dashboard
  - Quản lý jobs
  - Theo dõi applications
- [ ] Admin Dashboard
  - Moderation users
  - Approve jobs
- [ ] Profile settings
  - User settings
  - CV management

---

## Hỗ Trợ

Nếu gặp lỗi:

1. **Kiểm tra logs:**
   - Backend: Terminal nơi chạy `npm run dev`
   - Frontend: DevTools (F12) → Console tab

2. **Xem:**
   - INTEGRATION_GUIDE.md - Tài liệu đầy đủ
   - QUICK_START.md - Hướng dẫn nhanh
   - JobList-EXAMPLE.jsx - Ví dụ code

3. **Test API trực tiếp:**
   - Dùng `curl` hoặc Postman
   - Check `http://localhost:5000/health`

---

## Chúc Mừng! 🎉

Tích hợp Frontend-Backend của bạn đã hoàn tất! Bắt đầu với QUICK_START.md và bạn sẽ chạy được trong vài phút!

Chúc bạn code vui! 🚀

---

**Tạo:** 22/04/2026
**Trạng thái:** ✅ Hoàn tất
**Phiên bản:** 1.0
