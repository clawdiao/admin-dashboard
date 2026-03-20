import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';

export const auditLogger = async (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', async () => {
    try {
      const adminId = (req as any).admin?.id;
      if (adminId) {
        await prisma.adminLog.create({
          data: {
            adminId,
            action: `${req.method} ${req.path}`,
            entityType: req.params.id ? (req.params.id as string).split('/')[0] : undefined,
            entityId: req.params.id,
            details: {
              query: req.query,
              body: req.body,
              statusCode: res.statusCode
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
          }
        });
      }
    } catch (error) {
      console.error('Audit log failed:', error);
    }
  });

  next();
};
