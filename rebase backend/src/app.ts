import express from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';
import { webRouterApi } from './routers/api';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
webRouterApi(app);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
  console.log(`📚 API Docs: http://localhost:${port}/api/v1`);
});