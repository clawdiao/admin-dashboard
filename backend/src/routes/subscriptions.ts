import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
const router = Router();

// GET /api/admin/subscriptions
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, userId, limit = 50, page = 1 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = userId as string;

    const [subs, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        include: { user: { include: { tenant: true } } },
        take: Number(limit),
        skip: offset,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.subscription.count({ where })
    ]);

    res.json({
      subscriptions: subs,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    console.error('List subscriptions error:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// GET /api/admin/subscriptions/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const sub = await prisma.subscription.findUnique({
      where: { id: req.params.id },
      include: { user: { include: { tenant: true } } }
    });
    if (!sub) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    res.json(sub);
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// PATCH /api/admin/subscriptions/:id — actions: cancel, reactivate, changePlan
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { action, priceId, reason } = req.body;
    const sub = await prisma.subscription.findUnique({ where: { id: req.params.id } });
    if (!sub) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Ações via Stripe
    if (action === 'cancel') {
      await stripe.subscriptions.update(sub.stripeSubscriptionId, { cancel_at_period_end: true });
      await prisma.subscription.update({
        where: { id: sub.id },
        data: { cancelAtPeriodEnd: true, updatedAt: new Date() }
      });
    } else if (action === 'reactivate') {
      await stripe.subscriptions.update(sub.stripeSubscriptionId, { cancel_at_period_end: false });
      await prisma.subscription.update({
        where: { id: sub.id },
        data: { cancelAtPeriodEnd: false, status: 'active', updatedAt: new Date() }
      });
    } else if (action === 'changePlan' && priceId) {
      // Retrieve subscription item and update price
      const stripeSub = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
      const itemId = stripeSub.items.data[0].id;
      await stripe.subscriptionItems.update(itemId, { price: priceId });
      // Nota: o webhook vai atualizar nosso banco com novo valor/periodo
    }

    res.json({ success: true, message: `Subscription ${action} executed` });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

export default router;
