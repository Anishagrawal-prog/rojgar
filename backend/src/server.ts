import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth';
import interviewRoutes from './routes/interviews';
import projectRoutes from './routes/projects';
import errorHandler from './middleware/errorHandler';

const prisma = new PrismaClient();
const app = express();

app.use(
  cors({
    origin: ['http://localhost:3001'],
    credentials: true,
  })
);

app.use(express.json());

// Attach Prisma to each request
app.use((req, _res, next) => {
  (req as any).prisma = prisma;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/projects', projectRoutes);

// Global error handler
app.use(errorHandler);

const PORT = parseInt(process.env.PORT || '4001', 10);
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
