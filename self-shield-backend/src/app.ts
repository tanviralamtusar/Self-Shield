import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { generalLimiter } from './middleware/rateLimit.middleware';
import { errorHandler } from './utils/helpers';

// Route imports
import authRoutes from './api/auth/auth.routes';
import deviceRoutes from './api/devices/devices.routes';
import blocklistRoutes from './api/blocklists/blocklists.routes';
import commandRoutes from './api/commands/commands.routes';
import overrideRoutes from './api/overrides/overrides.routes';
import reportRoutes from './api/reports/reports.routes';
import auditRoutes from './api/audit/audit.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Global Middleware ---
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use(generalLimiter);

// --- Health Check ---
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// --- API Routes (v1) ---
app.use('/v1/auth', authRoutes);
app.use('/v1/devices', deviceRoutes);
app.use('/v1/blocklists', blocklistRoutes);
app.use('/v1/commands', commandRoutes);
app.use('/v1/overrides', overrideRoutes);
app.use('/v1/reports', reportRoutes);
app.use('/v1/audit', auditRoutes);

// --- Global Error Handler ---
app.use(errorHandler);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🛡️  Self-Shield API running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
