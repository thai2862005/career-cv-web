# Frontend-Backend Integration Guide

## Overview
Your application is now set up with a complete API integration layer that connects the React frontend to your Express.js backend.

## Backend Configuration

**Backend Server:**
- Location: `rebase backend/`
- Language: TypeScript + Express.js
- Port: `5000`
- API Base URL: `http://localhost:5000/api/v1`
- Database: Prisma ORM

**Start Backend:**
```bash
cd "rebase backend"
npm install
npm run db:push  # or npm run db:migrate
npm run dev      # Starts on http://localhost:5000
```

---

## Frontend Configuration

**Frontend Application:**
- Location: `JobEntry/`
- Framework: React + Vite + Tailwind CSS
- Port: `5173` (default Vite dev port)

**Environment Variables:**
- File: `JobEntry/.env`
- `VITE_API_BASE_URL=http://localhost:5000/api/v1`

**Start Frontend:**
```bash
cd JobEntry
npm install
npm run dev      # Starts on http://localhost:5173
```

---

## Architecture

### 1. API Service Layer (`src/services/api.js`)
Centralized API client handling all backend communication.

**Features:**
- Generic `apiRequest()` function for all HTTP methods
- Token-based authentication (JWT)
- Error handling with detailed response structure
- All endpoints grouped by feature (auth, jobs, companies, etc.)

**Usage:**
```javascript
import { jobAPI, authAPI } from '../services/api';

// Get all jobs
const response = await jobAPI.getAllJobs();
if (response.success) {
  console.log(response.data);
} else {
  console.error(response.error);
}
```

### 2. Authentication Context (`src/context/AuthContext.jsx`)
Global state management for user authentication.

**Features:**
- User profile management
- Token storage and retrieval
- Registration, login, logout
- Profile updates

**Usage:**
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  const handleLogin = async () => {
    const result = await login({ email: '...', password: '...' });
    if (result.success) {
      // User logged in
    }
  };
}
```

### 3. Custom Hooks (`src/hooks/`)

#### `useJobs.js`
Manages job-related data fetching.

```javascript
import { useJobs, useJobById, useSavedJobs } from '../hooks/useJobs';

// Get all jobs
const { jobs, loading, error, refetch } = useJobs();

// Get single job
const { job, loading, error } = useJobById(jobId);

// Get saved jobs (requires authentication)
const { jobs, saveJob, unsaveJob } = useSavedJobs();
```

#### `useCompanies.js`
Manages company-related data fetching.

```javascript
import { useCompanies, useCompanyById } from '../hooks/useCompanies';

// Get all companies
const { companies, loading, error } = useCompanies();

// Get single company with reviews
const { company, reviews, loading } = useCompanyById(companyId);
```

---

## API Endpoints

### Authentication
```
POST   /auth/register           - Register new user
POST   /auth/login              - Login user
GET    /auth/profile            - Get user profile (requires auth)
PUT    /auth/profile            - Update profile (requires auth)
PUT    /auth/change-password    - Change password (requires auth)
```

### Jobs
```
GET    /jobs                    - Get all jobs
GET    /jobs/:id                - Get job by ID
POST   /jobs/:id/save           - Save job (requires auth)
DELETE /jobs/:id/save           - Unsave job (requires auth)
GET    /saved-jobs              - Get saved jobs (requires auth)
POST   /hr/jobs                 - Create job (HR only)
GET    /hr/jobs                 - Get HR's jobs
PUT    /hr/jobs/:id             - Update job (HR only)
DELETE /hr/jobs/:id             - Delete job (HR only)
PUT    /hr/jobs/:id/toggle      - Toggle job status (HR only)
GET    /admin/jobs/pending      - Get pending jobs (Admin only)
PUT    /admin/jobs/:id/approve  - Approve job (Admin only)
```

### Companies
```
GET    /companies               - Get all companies
GET    /companies/:id           - Get company by ID
GET    /companies/:id/reviews   - Get company reviews
POST   /companies               - Create company (HR only)
GET    /hr/company              - Get HR's company
PUT    /companies/:id           - Update company (HR only)
POST   /companies/reviews       - Create review (Candidate only)
DELETE /admin/companies/:id     - Delete company (Admin only)
PUT    /admin/companies/:id/verify - Verify company (Admin only)
```

### CVs
```
POST   /cv                      - Upload CV (requires auth)
GET    /cv                      - Get user's CVs
GET    /cv/:id                  - Get specific CV
PUT    /cv/:id                  - Update CV
DELETE /cv/:id                  - Delete CV
PUT    /cv/:id/default          - Set default CV
```

### Applications
```
POST   /applications            - Submit application (requires auth)
GET    /applications            - Get user's applications
GET    /applications/:id        - Get application details
DELETE /applications/:id        - Withdraw application
GET    /hr/jobs/:jobId/applications - Get job applications (HR)
PUT    /applications/:id        - Update application status
```

### Categories
```
GET    /categories              - Get all categories
GET    /categories/:id          - Get category
POST   /categories              - Create category (Admin only)
PUT    /categories/:id          - Update category (Admin only)
DELETE /categories/:id          - Delete category (Admin only)
```

### Notifications
```
GET    /notifications           - Get user notifications
PUT    /notifications/:id       - Mark notification as read
PUT    /notifications/mark-all-read - Mark all as read
DELETE /notifications/:id       - Delete notification
```

---

## Integration Examples

### Example 1: Login Component
```javascript
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login({ email, password });
    if (!result.success) {
      setError(result.error);
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
        placeholder="Password"
      />
      <button disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
```

### Example 2: Job List Component
```javascript
import { useJobs } from '../hooks/useJobs';
import { Loader } from 'lucide-react';

export function JobList() {
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

### Example 3: Save Job
```javascript
import { useSavedJobs } from '../hooks/useJobs';
import { Heart } from 'lucide-react';

export function JobCard({ jobId }) {
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

## Authentication Flow

### Token Storage
- Tokens are stored in `localStorage` as `authToken`
- Automatically sent in `Authorization: Bearer <token>` header
- Removed on logout

### Protected Routes
For protected pages, check authentication:
```javascript
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export function ProtectedPage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <div>Protected content</div>;
}
```

---

## Troubleshooting

### "Cannot connect to backend"
1. Check backend is running: `http://localhost:5000/health`
2. Verify `.env` has correct `VITE_API_BASE_URL`
3. Check CORS is enabled in backend (it should be)

### "401 Unauthorized"
1. Token may have expired
2. Clear localStorage and login again
3. Check token is being sent in request headers

### "CORS Error"
- Backend should have `cors()` middleware enabled
- Check `rebase backend/src/app.ts`

### "API returns 404"
- Check endpoint path matches backend routes
- Verify all required parameters are provided

---

## Next Steps

1. **Update JobList.jsx** to use `useJobs` hook
2. **Update JobDetail.jsx** to use `useJobById` hook
3. **Update CompanyList.jsx** to use `useCompanies` hook
4. **Create Registration form** using `authAPI.register`
5. **Add error handling** with user-friendly messages
6. **Test all API calls** before deployment

---

## Files Created/Modified

### New Files:
- `src/services/api.js` - API client service
- `src/context/AuthContext.jsx` - Authentication context
- `src/hooks/useJobs.js` - Job data hooks
- `src/hooks/useCompanies.js` - Company data hooks
- `.env` - Environment variables
- `INTEGRATION_GUIDE.md` - This file

### Modified Files:
- `src/App.jsx` - Wrapped with AuthProvider
- `src/candidate/Home.jsx` - Updated to use API

---

## Support

For issues or questions:
1. Check the API response in browser DevTools (Network tab)
2. Review error messages in console
3. Verify backend is running and accessible
4. Check backend logs for detailed error information

Good luck with your integration! 🚀
