// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu seed dữ liệu...');

  const commonPassword = await bcrypt.hash('hackathon123', 10);

  // 1. Tạo SuperAdmin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@smartqueue.com' },
    update: { password: commonPassword },
    create: {
      email: 'admin@smartqueue.com',
      password: commonPassword,
      name: 'Super Admin Tổng',
      phone: '0848489039',
      role: Role.SUPERADMIN,
    },
  });
  console.log('Đã tạo SuperAdmin: admin@smartqueue.com / hackathon123');

  // 2. Tạo một User (Khách hàng)
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@gmail.com' },
    update: { password: commonPassword },
    create: {
      email: 'user@gmail.com',
      password: commonPassword,
      name: 'Nguyễn Văn Khách',
      phone: '0909123456',
      role: Role.USER,
    },
  });
  console.log('Đã tạo User: user@gmail.com / hackathon123');

  // 3. Tạo một Enterprise (Doanh nghiệp - Highlands Coffee)
  const highlandsUser = await prisma.user.upsert({
    where: { email: 'highlands@enterprise.com' },
    update: { password: commonPassword },
    create: {
      email: 'highlands@enterprise.com',
      password: commonPassword,
      name: 'Highlands Coffee Admin',
      phone: '19001755',
      role: Role.ENTERPRISE,
    },
  });

  const highlandsEnt = await prisma.enterprise.upsert({
    where: { userId: highlandsUser.id },
    update: {},
    create: {
      name: 'Highlands Coffee',
      userId: highlandsUser.id,
    },
  });
  console.log('Đã tạo Enterprise: highlands@enterprise.com / hackathon123');

  // 4. Tạo các Branch cho Highlands (Địa chỉ thật tại HCM)
  // Xóa branch cũ để tránh lỗi duplicate khi chạy lại seed
  await prisma.branch.deleteMany({ where: { enterpriseId: highlandsEnt.id } });

  const branches = [
    {
      name: 'Highlands Coffee Landmark 81',
      address: 'Vinhomes Central Park, Bình Thạnh, TP. HCM',
      lat: 10.7951,
      lng: 106.7218,
      maxCapacity: 60,
      cameraUrl: 'https://stream.smartqueue.com/highlands-l81',
    },
    {
      name: 'Highlands Coffee Bitexco',
      address: '2 Hải Triều, Bến Nghé, Quận 1, TP. HCM',
      lat: 10.7718,
      lng: 106.7044,
      maxCapacity: 40,
      cameraUrl: 'https://stream.smartqueue.com/highlands-bitexco',
    },
    {
      name: 'Highlands Coffee Diamond Plaza',
      address: '34 Lê Duẩn, Bến Nghé, Quận 1, TP. HCM',
      lat: 10.7811,
      lng: 106.6997,
      maxCapacity: 50,
      cameraUrl: 'https://stream.smartqueue.com/highlands-diamond',
    },
    {
      name: 'Highlands Coffee Phan Xích Long',
      address: '190 Phan Xích Long, Phú Nhuận, TP. HCM',
      lat: 10.7963,
      lng: 106.6852,
      maxCapacity: 35,
      cameraUrl: 'https://stream.smartqueue.com/highlands-pxl',
    },
  ];

  for (const b of branches) {
    await prisma.branch.create({
      data: {
        ...b,
        enterpriseId: highlandsEnt.id,
        currentLoad: Math.floor(Math.random() * b.maxCapacity),
      },
    });
  }
  console.log(`Đã tạo ${branches.length} chi nhánh cho Highlands Coffee.`);

  // 5. Tạo thêm Phê La Enterprise
  const pheLaUser = await prisma.user.upsert({
    where: { email: 'phela@enterprise.com' },
    update: { password: commonPassword },
    create: {
      email: 'phela@enterprise.com',
      password: commonPassword,
      name: 'Phê La Admin',
      phone: '19003013',
      role: Role.ENTERPRISE,
    },
  });

  const pheLaEnt = await prisma.enterprise.upsert({
    where: { userId: pheLaUser.id },
    update: {},
    create: {
      name: 'Phê La',
      userId: pheLaUser.id,
    },
  });

  await prisma.branch.deleteMany({ where: { enterpriseId: pheLaEnt.id } });

  const pheLaBranches = [
    {
      name: 'Phê La Lý Tự Trọng',
      address: '65 Lý Tự Trọng, Quận 1, TP. HCM',
      lat: 10.7766,
      lng: 106.7001,
      maxCapacity: 30,
      cameraUrl: 'https://stream.smartqueue.com/phela-ltt',
    },
    {
      name: 'Phê La Hồ Tùng Mậu',
      address: '125 Hồ Tùng Mậu, Quận 1, TP. HCM',
      lat: 10.7725,
      lng: 106.7038,
      maxCapacity: 25,
      cameraUrl: 'https://stream.smartqueue.com/phela-htm',
    },
  ];

  for (const b of pheLaBranches) {
    await prisma.branch.create({
      data: {
        ...b,
        enterpriseId: pheLaEnt.id,
        currentLoad: Math.floor(Math.random() * b.maxCapacity),
      },
    });
  }
  console.log(`Đã tạo ${pheLaBranches.length} chi nhánh cho Phê La.`);

  console.log('\nSeed dữ liệu hoàn tất! Thông tin tài khoản test:');
  console.log('--------------------------------------------------');
  console.log('1. SuperAdmin: admin@smartqueue.com / hackathon123');
  console.log('2. User:       user@gmail.com / hackathon123');
  console.log('3. Enterprise: highlands@enterprise.com / hackathon123');
  console.log('4. Enterprise: phela@enterprise.com / hackathon123');
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
