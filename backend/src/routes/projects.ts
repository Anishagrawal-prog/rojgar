import express from 'express';
import { AuthRequest } from '../middleware/auth'; // 1. Import the new Request type

const router = express.Router();

// This route is protected, so we know req.userId will be there.

// GET /api/projects
// Fetches projects ONLY for the logged-in user
router.get('/', async (req, res) => {
  const prisma = (req as any).prisma;
  const userId = (req as AuthRequest).userId; // Get the user's ID

  const projects = await prisma.project.findMany({
    where: {
      ownerId: userId, // <-- 2. THE FIX: Changed from userId to ownerId
    },
  });

  res.json(projects);
});

// POST /api/projects
// Creates a new project for the logged-in user
router.post('/', async (req, res) => {
  const prisma = (req as any).prisma;
  const userId = (req as AuthRequest).userId; // Get the user's ID
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const newProject = await prisma.project.create({
    data: {
      title,
      description,
      ownerId: userId, // <-- 2. THE FIX: Changed from userId to ownerId
    },
  });

  res.status(201).json(newProject);
});

export default router;

