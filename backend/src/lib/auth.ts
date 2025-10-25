import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export function signToken(payload: any) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '15m' });
}
export function signRefresh(payload: any) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction){
  try {
    const header = req.header('Authorization');
    if (!header) return res.status(401).json({ message: 'Unauthorized' });
    const token = header.split(' ')[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const prisma = (req as any).prisma;
    const user = await prisma.user.findUnique({ where: { id: decoded.id }});
    if(!user) return res.status(401).json({ message: 'Unauthorized' });
    (req as any).user = user;
    next();
  } catch (err) { return res.status(401).json({ message: 'Unauthorized' }); }
}

export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}
