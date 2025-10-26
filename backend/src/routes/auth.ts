// src/routes/auth.ts
import express from 'express';
import argon2 from 'argon2';
import { Role } from '@prisma/client'; // Prisma Enum import
import { signToken, signRefresh } from '../lib/auth';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const prisma = (req as any).prisma;

  // 1️⃣ Validate required fields
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // 2️⃣ Convert role to uppercase and validate
  const validRole = role.toUpperCase();
  if (!Object.values(Role).includes(validRole as Role)) {
    return res.status(400).json({ 
      message: `Invalid role. Must be one of: ${Object.values(Role).join(', ')}` 
    });
  }

  // 3️⃣ Check if user already exists
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  // 4️⃣ Hash password
  const passwordHash = await argon2.hash(password);

  // 5️⃣ Create user with validated enum role
  const user = await prisma.user.create({ 
    data: { name, email, passwordHash, role: validRole as Role } 
  });

  // 6️⃣ Generate tokens
  const token = signToken({ id: user.id });
  const refresh = signRefresh({ id: user.id });

  res.json({ 
    token, 
    refresh, 
    user: { id: user.id, name, email, role: user.role } 
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const prisma = (req as any).prisma;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const ok = await argon2.verify(user.passwordHash, password);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

  const token = signToken({ id: user.id });
  const refresh = signRefresh({ id: user.id });

  res.json({ 
    token, 
    refresh, 
    user: { id: user.id, name: user.name, email: user.email, role: user.role } 
  });
});

export default router;
