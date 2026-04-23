# Quick Start Guide - Frontend & Backend Integration

## Step 1: Setup Backend

```bash
# Navigate to backend directory
cd "rebase backend"

# Install dependencies
npm install

# Setup database (choose one)
npm run db:push              # Push schema to existing DB
# OR
npm run db:migrate           # Create migrations

# Optional: Seed database with sample data
npm run db:seed

# Start backend server
npm run dev
```

**Expected Output:**
```
✅ Server is running on http://localhost:5000
📚 API Docs: http://localhost:5000/api/v1
```

---

## Step 2: Setup Frontend

```bash
# Navigate to frontend directory
cd JobEntry

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
  VITE v8.0.9  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## Step 3: Test Integration

### Test 1: Check Backend Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-04-22T..."
}
```

### Test 2: Fetch Jobs from Frontend
1. Open http://localhost:5173 in browser
2. Go to Home page
3. Should see "Featured Jobs" section loading jobs from backend
4. Open DevTools (F12) → Network tab → filter for "jobs"
5. Should see request to `http://localhost:5000/api/v1/jobs`

### Test 3: Login/Register
1. Click "Sign In" or "Create Account" button
2. Try to register or login
3. Should see API call in Network tab
4. Check DevTools Console for any errors

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000   # Windows

# Kill process using the port
taskkill /PID <PID> /F         # Windows

# Restart backend
npm run dev
```

### "Cannot connect to backend" error
1. **Check backend is running** - see terminal output
2. **Check frontend .env file:**
   ```
   cat JobEntry/.env
   # Should show: VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```
3. **Check CORS** - should be enabled in `rebase backend/src/app.ts`

### Frontend shows "No jobs available"
1. Check backend is running
2. Check database has data:
   ```bash
   cd "rebase backend"
   npm run db:studio  # Opens Prisma Studio to view DB
   ```
3. Check API call in DevTools Network tab
4. Look for error responses (4xx or 5xx)

### Token/Authentication errors
1. **Clear localStorage:**
   ```javascript
   // In DevTools Console:
   localStorage.clear()
   ```
2. **Reload page** and try logging in again
3. **Check backend logs** for authentication errors

---

## File Structure

```
career-cv-web/
├── JobEntry/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js          # API client (NEW)
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Auth provider (NEW)
│   │   ├── hooks/
│   │   │   ├── useJobs.js      # Job hooks (NEW)
│   │   │   └── useCompanies.js # Company hooks (NEW)
│   │   ├── candidate/
│   │   │   ├── Home.jsx        # Updated with API
│   │   │   ├── JobList.jsx     # TODO: Update
│   │   │   ├── JobDetail.jsx   # TODO: Update
│   │   │   └── ...
│   │   ├── App.jsx             # Updated with AuthProvider
│   │   └── ...
│   ├── .env                    # API configuration (NEW)
│   ├── INTEGRATION_GUIDE.md    # Full guide (NEW)
│   └── QUICK_START.md          # This file
│
└── rebase backend/              # Backend (Express + TypeScript)
    ├── src/
    │   ├── app.ts              # Express server (CORS enabled)
    │   ├── routers/
    │   │   └── api.ts          # All API routes
    │   ├── controller/         # Route controllers
    │   ├── service/            # Business logic
    │   ├── config/             # Configuration
    │   └── ...
    ├── .env                    # Backend configuration
    ├── prisma/
    │   ├── schema.prisma       # Database schema
    │   └── seed.ts             # Sample data
    └── package.json
```

---

## API Testing with Postman (Optional)

If you want to test API endpoints manually:

### 1. Import requests to Postman
Create collection with these requests:

**Login**
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**Get All Jobs**
```
GET http://localhost:5000/api/v1/jobs
```

**Get All Companies**
```
GET http://localhost:5000/api/v1/companies
```

**Get Job by ID**
```
GET http://localhost:5000/api/v1/jobs/1
```

---

## Next Steps

### Immediate Tasks (Frontend)
- [ ] Test Home page jobs loading
- [ ] Test Home page companies loading
- [ ] Update JobList.jsx to use API
- [ ] Update CompanyList.jsx to use API
- [ ] Create/update Auth.jsx component for login/register

### Short Term
- [ ] Implement job search/filter functionality
- [ ] Add job save functionality
- [ ] Create job application flow
- [ ] Add user profile management

### Medium Term
- [ ] HR Dashboard with job management
- [ ] Admin Dashboard for moderation
- [ ] CV upload and management
- [ ] Application tracking

### Backend Enhancements
- [ ] Add pagination to list endpoints
- [ ] Add search/filter support
- [ ] Add validation rules
- [ ] Add email notifications

---

## Common Commands

```bash
# Backend
cd "rebase backend"
npm run dev                # Start server
npm run db:push           # Sync database
npm run db:studio         # Open database viewer
npm run db:seed           # Seed sample data
npm run build             # Build TypeScript

# Frontend
cd JobEntry
npm run dev               # Start dev server
npm run build             # Build for production
npm run preview           # Preview production build
npm run lint              # Check code quality
```

---

## Environment Variables

### Backend `.env` (rebase backend/.env)
```
DATABASE_URL=...         # Database connection
PORT=5000               # Server port
NODE_ENV=development    # Environment
JWT_SECRET=...          # JWT secret key
```

### Frontend `.env` (JobEntry/.env)
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Career CV Portal
```

---

## Contact & Support

If you encounter issues:

1. **Check the logs:**
   - Backend: Terminal where you ran `npm run dev`
   - Frontend: DevTools (F12) → Console tab

2. **Review:**
   - INTEGRATION_GUIDE.md for detailed documentation
   - Backend API routes in `rebase backend/src/routers/api.ts`

3. **Test API directly:**
   - Use `curl` or Postman
   - Check `http://localhost:5000/health`

Good luck! 🚀
