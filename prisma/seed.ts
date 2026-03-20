// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu seed dữ liệu...');

  // Xóa sạch data cũ nếu cần (cẩn thận khi dùng thật)
  // await prisma.user.deleteMany(); 

  const hashedPassword = await bcrypt.hash('hackathon123', 10);

  // Dùng upsert để chạy seed nhiều lần không bị lỗi duplicate email
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@smartqueue.com' },
    update: {}, // Nếu có rồi thì không làm gì
    create: {
      email: 'admin@smartqueue.com',
      password: hashedPassword,
      name: 'Super Admin Tổng',
      phone: '0848489039', // Số liên hệ lúc cần thiết
      role: Role.SUPERADMIN,
    },
  });

  console.log('Đã tạo SuperAdmin thành công:', superAdmin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });