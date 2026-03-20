import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// GET /api/admin/logs
// Query: ?page=1&limit=50&adminId=...&action=...
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50, adminId, action } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (adminId) where.adminId = adminId as string;
    if (action) where.action = { contains: action as string, mode: 'insensitive' };

    const [logs, total] = await Promise.all([
      prisma.adminLog.findMany({
        where,
        include: { admin: { select: { email: true, role: true } } },
        take: Number(limit),
        skip: offset,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.adminLog.count({ where })
    ]);

    res.json({
      logs,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    console.error('Logs error:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

export default router;
