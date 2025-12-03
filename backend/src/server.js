import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initDatabase } from './database/db.js';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import subjectsRoutes from './routes/subjects.js';
import materialsRoutes from './routes/materials.js';
import aiRoutes from './routes/ai.js';
import progressRoutes from './routes/progress.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
initDatabase().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploaded materials
const uploadsDir = join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsDir));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NER Backend API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/progress', progressRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API available at http://localhost:${PORT}/api`);
  console.log(`🤖 AI Tutor endpoint: http://localhost:${PORT}/api/ai`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
});

export default app;
