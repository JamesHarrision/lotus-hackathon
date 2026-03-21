// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu seed dữ liệu...');

  // 1. Tạo SuperAdmin
  const hashedPassword = await bcrypt.hash('hackathon123', 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@smartqueue.com' },
    update: {},
    create: {
      email: 'admin@smartqueue.com',
      password: hashedPassword,
      name: 'Super Admin Tổng',
      phone: '0848489039',
      role: Role.SUPERADMIN,
    },
  });
  console.log('Đã tạo SuperAdmin:', superAdmin.email);

  // 2. Tạo một Enterprise (ví dụ Highlands Coffee)
  const highlandsUser = await prisma.user.upsert({
    where: { email: 'contact@highlandscoffee.com.vn' },
    update: {},
    create: {
      email: 'contact@highlandscoffee.com.vn',
      password: hashedPassword,
      name: 'Highlands Coffee HQ',
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
  console.log('Đã tạo Enterprise:', highlandsEnt.name);

  // 3. Tạo các Branch cho Highlands (Địa chỉ thật tại HCM)
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
        currentLoad: Math.floor(Math.random() * b.maxCapacity), // Random load ban đầu cho demo
      },
    });
  }
  console.log(`Đã tạo ${branches.length} chi nhánh cho Highlands Coffee.`);

  // 4. Tạo thêm một Enterprise khác (ví dụ Phê La)
  const pheLaUser = await prisma.user.upsert({
    where: { email: 'hello@phela.vn' },
    update: {},
    create: {
      email: 'hello@phela.vn',
      password: hashedPassword,
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

  console.log('Seed dữ liệu hoàn tất! Chúc bạn "vibe" frontend rực rỡ.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
