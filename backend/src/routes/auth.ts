// src/routes/auth.ts
import express from 'express';
import argon2 from 'argon2';
import { Role } from '@prisma/client'; // <-- 1. IMPORT THE ENUM
import { signToken, signRefresh } from '../lib/auth';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const prisma = (req as any).prisma;

  // 2. VALIDATE THE INCOMING ROLE
  if (!role || !Object.values(Role).includes(role)) {
    return res.status(400).json({ 
      message: `Invalid role. Must be one of: ${Object.values(Role).join(', ')}` 
    });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ message: 'Email exists' });
  
  const passwordHash = await argon2.hash(password);
  
  // Now, Prisma will accept the validated 'role' string
  const user = await prisma.user.create({ data: { name, email, passwordHash, role } });
  
  const token = signToken({ id: user.id });
  const refresh = signRefresh({ id: user.id });
  
  res.json({ token, refresh, user: { id: user.id, name, email, role: user.role } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const prisma = (req as any).prisma;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: 'Invalid cred' });
  
  const ok = await argon2.verify(user.passwordHash, password);
  if (!ok) return res.status(400).json({ message: 'Invalid cred' });
  
  const token = signToken({ id: user.id });
  const refresh = signRefresh({ id: user.id });
  
  res.json({ token, refresh, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

export default router;