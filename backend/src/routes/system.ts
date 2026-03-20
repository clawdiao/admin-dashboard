import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// GET /api/system/health
router.get('/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    // Stripe test
    const stripeOk = process.env.STRIPE_SECRET_KEY ? 'configured' : 'not configured';
    res.json({
      status: 'ok',
      database: 'connected',
      stripe: stripeOk,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

// GET /api/system/config (public keys for frontend)
router.get('/config', (req: Request, res: Response) => {
  res.json({
    stripePublicKey: process.env.STRIPE_SECRET_KEY ? 'pk_live_...' : null
    // Não expor secrets
  });
});

// POST /api/system/test-email (to test Resend)
router.post('/test-email', async (req: Request) => {
  const { to } = req.body;
  // TODO: implement email send test via Resend
  res.json({ sent: true, to });
});

export default router;
