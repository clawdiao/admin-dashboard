import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret = process.env.ADMIN_JWT_SECRET;

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!secret) {
      throw new Error('ADMIN_JWT_SECRET not configured');
    }

    const decoded: any = jwt.verify(token, secret);
    if (!decoded.adminId) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    (req as any).admin = { id: decoded.adminId, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
