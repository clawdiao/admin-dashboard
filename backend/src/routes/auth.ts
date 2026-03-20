import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() }
    });

    const token = jwt.sign(
      { adminId: admin.id, role: admin.role, email: admin.email },
      process.env.ADMIN_JWT_SECRET!,
      { expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '1h' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        twoFactorEnabled: admin.twoFactorEnabled
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token' });
    }
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, process.env.ADMIN_JWT_SECRET!);
    const admin = await prisma.adminUser.findUnique({ where: { id: decoded.adminId } });
    if (!admin) {
      return res.status(401).json({ error: 'Admin not found' });
    }
    res.json({
      id: admin.id,
      email: admin.email,
      role: admin.role,
      twoFactorEnabled: admin.twoFactorEnabled,
      lastLoginAt: admin.lastLoginAt
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
