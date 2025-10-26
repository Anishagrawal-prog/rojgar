import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// We'll add the userId to the Express Request type
export interface AuthRequest extends Request {
  userId?: number;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // 1. Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (token == null) {
    // 401 Unauthorized: No token was provided
    return res.status(401).json({ message: 'No token provided' });
  }

  // 2. Verify the token
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: number; iat: number; exp: number };

    // 3. Attach the user's ID to the request object
    req.userId = payload.id;

    // 4. Call next() to pass the request to the actual route
    next();
  } catch (err) {
    // 403 Forbidden: The token is invalid or expired
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};