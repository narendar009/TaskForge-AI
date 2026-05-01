import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// In production, FRONTEND_URL is set in Railway dashboard.
// During local dev it falls back to localhost:5173.
const allowedOrigins = [
  process.env.FRONTEND_URL,          // e.g. https://taskforge-ai.vercel.app
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean); // remove undefined if FRONTEND_URL not set locally

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, Railway health-checks, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

// ── Body parser ───────────────────────────────────────────────────────────────
app.use(express.json());

// ── Health-check (Railway / Render ping) ─────────────────────────────────────
app.get('/', (_req, res) => res.json({ status: 'TaskForge AI API is running ✅' }));
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// ── Global error handler ─────────────────────────────────────────────────────
// Catches async errors thrown without try/catch (Express 5 propagates them)
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  const status = err.status ?? 500;
  res.status(status).json({ message: err.message ?? 'Internal server error' });
});

export default app;