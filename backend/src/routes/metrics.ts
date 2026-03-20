import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// GET /api/admin/metrics/overview
router.get('/overview', async (req: Request, res: Response) => {
  try {
    // Total users
    const totalUsers = await prisma.user.count();

    // Active subscriptions (status active)
    const activeSubs = await prisma.subscription.count({ where: { status: 'active' } });

    // MRR (sum of subscription price? we don't store price in DB; we can fetch from Stripe or store in Subscription as `priceMonthly`)
    // For now, return placeholder. In production we would sync stripe subscription items into a local table (e.g., subscription_items)
    // or compute via Stripe API.

    // New users last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsers = await prisma.user.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    });

    // Trials expiring next 7 days
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const trialsExpiring = await prisma.tenant.count({
      where: { status: 'TRIAL', trialEndsAt: { lte: nextWeek, gte: new Date() } }
    });

    res.json({
      totalUsers,
      activeSubs,
      newUsers,
      trialsExpiring,
      note: 'MRR calculation requires Stripe sync or local price field'
    });
  } catch (error) {
    console.error('Metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// GET /api/admin/metrics/revenue?period=monthly&year=2025
router.get('/revenue', async (req: Request, res: Response) => {
  // Placeholder: In real implementation, query Stripe or local aggregated table
  res.json({
    message: 'Revenue endpoint will return time series after Stripe sync webhook is implemented',
    data: []
  });
});

// GET /api/admin/metrics/conversion
router.get('/conversion', async (req: Request, res: Response) => {
  // Placeholder: need tracking events (landing page visits, signups, payments)
  res.json({
    message: 'Conversion funnel requires event tracking (e.g., Plausible, PostHog)',
    data: {}
  });
});

export default router;
