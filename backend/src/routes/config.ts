import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import Stripe from 'stripe';

const router = Router();

// GET /api/admin/system/config — list all configs (masked)
router.get('/config', async (req: Request, res: Response) => {
  try {
    const configs = await prisma.systemConfig.findMany({
      orderBy: { key: 'asc' }
    });

    // Mascarar valores sensíveis
    const masked = configs.map(c => ({
      key: c.key,
      value: c.value ? '***MASKED***' : null,
      description: c.description,
      updatedAt: c.updatedAt
    }));

    res.json({ configs: masked });
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({ error: 'Failed to fetch config' });
  }
});

// POST /api/admin/system/config — upsert config
router.post('/config', async (req: Request, res: Response) => {
  try {
    const { key, value, description } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({ error: 'Key and value required' });
    }

    const config = await prisma.systemConfig.upsert({
      where: { key },
      update: { value, description, updatedAt: new Date() },
      create: { key, value, description }
    });

    res.json(config);
  } catch (error) {
    console.error('Save config error:', error);
    res.status(500).json({ error: 'Failed to save config' });
  }
});

// DELETE /api/admin/system/config/:key
router.delete('/config/:key', async (req: Request, res: Response) => {
  try {
    await prisma.systemConfig.delete({ where: { key: req.params.key } });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete config error:', error);
    res.status(500).json({ error: 'Failed to delete config' });
  }
});

// GET /api/admin/system/config/:key (get raw value — admin only)
router.get('/config/:key', async (req: Request, res: Response) => {
  try {
    const config = await prisma.systemConfig.findUnique({ where: { key: req.params.key } });
    if (!config) {
      return res.status(404).json({ error: 'Config not found' });
    }
    // Only SUPER_ADMIN can see raw values
    if ((req as any).admin.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    res.json(config);
  } catch (error) {
    console.error('Get config value error:', error);
    res.status(500).json({ error: 'Failed to fetch config value' });
  }
});

export default router;
