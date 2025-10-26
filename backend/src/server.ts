import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// --- Route & Middleware Imports ---
import authRoutes from './routes/auth';
import interviewRoutes from './routes/interviews';
import projectRoutes from './routes/projects';
import errorHandler from './middleware/errorHandler';
// 1. IMPORT the auth middleware
import { authMiddleware } from './middleware/auth';

const prisma = new PrismaClient();
const app = express();

// --- Core Middleware ---
app.use(
  cors({
    origin: 'http://localhost:3001', // Your frontend's URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow all methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly allow headers
  })
);

// This is in the correct place! It fixes the 'req.body' error.
app.use(express.json());

// Attach Prisma to each request
app.use((req, _res, next) => {
  (req as any).prisma = prisma;
  next();
});

// --- Routes ---
// This route is PUBLIC (no authMiddleware)
app.use('/api/auth', authRoutes);

// 2. USE the auth middleware to protect these routes
app.use('/api/interviews', authMiddleware, interviewRoutes);
app.use('/api/projects', authMiddleware, projectRoutes);

// --- Error Handler (must be after routes) ---
app.use(errorHandler);

// --- Start Server ---
const PORT = parseInt(process.env.PORT || '4001', 10);
app.listen(PORT, () => console.log(`API listening on ${PORT}`));