import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default admin user (change password!)
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@clawdiao.com' },
    update: {},
    create: {
      id: 'admin_001',
      email: 'admin@clawdiao.com',
      passwordHash: adminPassword,
      role: 'SUPER_ADMIN',
      twoFactorEnabled: false
    }
  });
  console.log('✅ Admin user created/updated:', admin.email);

  // Create sample system metric (today)
  const today = new Date();
  await prisma.systemMetric.upsert({
    where: { metricDate: today },
    update: {},
    create: {
      metricDate: today,
      mrr: 0,
      arr: 0,
      activeUsers: 0,
      newUsers: 0,
      churnedUsers: 0,
      conversionRate: 0
    }
  });
  console.log('✅ Sample system metric created');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
