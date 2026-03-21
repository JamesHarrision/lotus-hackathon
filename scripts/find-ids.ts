
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function findIds() {
  const admin = await prisma.user.findUnique({ where: { email: 'admin@smartqueue.com' } });
  const user = await prisma.user.findUnique({ where: { email: 'user@gmail.com' } });
  const highlands = await prisma.user.findUnique({ where: { email: 'highlands@enterprise.com' } });
  const ent = await prisma.enterprise.findFirst({ where: { name: 'Highlands Coffee' } });
  const branch = await prisma.branch.findFirst({ where: { enterpriseId: ent?.id } });

  const allEnts = await prisma.enterprise.findMany();
  console.log('ALL_ENTERPRISES:', allEnts.map(e => ({ id: e.id, name: e.name, userId: e.userId })));

  console.log('ADMIN_ID:', admin?.id);
  console.log('USER_ID:', user?.id);
  console.log('HIGHLANDS_USER_ID:', highlands?.id);
  console.log('HIGHLANDS_ENT_ID:', ent?.id);
  console.log('HIGHLANDS_BRANCH_ID:', branch?.id);

  const incentives = await prisma.incentive.findMany();
  console.log('ALL_INCENTIVES:', incentives.map(i => ({ code: i.code, entId: i.enterpriseId })));

  await prisma.$disconnect();
}

findIds();
