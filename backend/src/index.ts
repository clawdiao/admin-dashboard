import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import subscriptionRoutes from './routes/subscriptions';
import metricsRoutes from './routes/metrics';
import logsRoutes from './routes/logs';
import systemRoutes from './routes/system';

import { adminAuth } from './middleware/adminAuth';
import { auditLogger } from './middleware/audit';
import { errorHandler } from './middleware/error';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Audit logging
app.use(auditLogger);

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Protected admin routes
app.use('/api/admin/users', adminAuth, userRoutes);
app.use('/api/admin/subscriptions', adminAuth, subscriptionRoutes);
app.use('/api/admin/metrics', adminAuth, metricsRoutes);
app.use('/api/admin/logs', adminAuth, logsRoutes);
app.use('/api/admin/system', adminAuth, systemRoutes);

// Health check
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: 'db connection failed' });
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🦁 Admin Dashboard API running on port ${PORT}`);
  console.log(`🔗 Health: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export { prisma };
