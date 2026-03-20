import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// GET /api/admin/users
// Query params: ?page=1&limit=20&search=email&tenantId=...
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, search, tenantId } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: 'insensitive' } },
        { name: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    if (tenantId) {
      where.tenantId = tenantId as string;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: { tenant: true },
        take: Number(limit),
        skip: offset,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      users,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/admin/users/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        tenant: true,
        subscription: true
      }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PATCH /api/admin/users/:id — update notes suspension
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { isActive, notes } = req.body;
    const updates: any = {};
    if (isActive !== undefined) {
      // Exemplo: poderíamos ter campo isActive no User (não existe ainda).
      // Por ora, vamos apenas inserir notas em um campo personalizado (ex: metadata)
      // Melhor: alterar tenant status?
    }
    // Para MVP, só permitimos atualizar o tenant (logo, cor, etc)
    if (req.body.name || req.body.logoUrl || req.body.primaryColor || req.body.secondaryColor) {
      const tenant = await prisma.tenant.update({
        where: { id: req.body.tenantId || (await prisma.user.findUnique({ where: { id: req.params.id } })).tenantId },
        data: {
          name: req.body.name,
          logoUrl: req.body.logoUrl,
          primaryColor: req.body.primaryColor,
          secondaryColor: req.body.secondaryColor
        }
      });
      return res.json(tenant);
    }

    res.status(400).json({ error: 'No valid fields to update' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;
