// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Đang dọn dẹp Database cũ...');
  await prisma.branchLoadLog.deleteMany();
  await prisma.routingHistory.deleteMany();
  await prisma.incentive.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.enterprise.deleteMany();
  await prisma.user.deleteMany();

  console.log('🚀 Bắt đầu tạo bộ dữ liệu "Vàng" cho Demo Hackathon...');

  const password = await bcrypt.hash('hackathon123', 10);

  // 1. Tạo SuperAdmin
  await prisma.user.create({
    data: {
      email: 'admin@smartqueue.com',
      password,
      name: 'Super Admin',
      role: Role.SUPERADMIN,
    },
  });

  // 2. Tạo Doanh nghiệp: Highlands Coffee (Chuỗi lớn nhất để demo)
  const highlandsUser = await prisma.user.create({
    data: {
      email: 'highlands@demo.com',
      password,
      name: 'Highlands Admin',
      role: Role.ENTERPRISE,
    },
  });

  const highlandsEnt = await prisma.enterprise.create({
    data: {
      name: 'Highlands Coffee',
      userId: highlandsUser.id,
    },
  });

  // Tạo Incentive cho Highlands
  await prisma.incentive.createMany({
    data: [
      { enterpriseId: highlandsEnt.id, code: 'HIGHLANDS2K', description: 'Giảm 2k khi chuyển vùng xa', discountVal: 2000, isPercentage: false },
      { enterpriseId: highlandsEnt.id, code: 'HIGHLANDS5K', description: 'Tặng 5k khi hỗ trợ điều phối tải', discountVal: 5000, isPercentage: false },
    ]
  });

  // Tạo các chi nhánh Highlands tại Quận 1, Quận 3, Bình Thạnh (Gần nhau để dễ demo reroute)
  const highlandsBranches = [
    { 
      name: 'Highlands Landmark 81', 
      address: 'Vinhomes Central Park, Bình Thạnh', 
      lat: 10.7951, 
      lng: 106.7218, 
      maxCapacity: 100,
      cameraUrl: 'http://192.168.1.10:8080/video' // THAY ĐỔI: Địa chỉ IP Camera điện thoại của bạn
    },
    { name: 'Highlands Bitexco', address: 'Số 2 Hải Triều, Quận 1', lat: 10.7718, lng: 106.7044, maxCapacity: 80, cameraUrl: 'https://demo-stream.smartqueue.vn/bitexco' },
    { name: 'Highlands Diamond Plaza', address: '34 Lê Duẩn, Quận 1', lat: 10.7811, lng: 106.6997, maxCapacity: 60, cameraUrl: 'https://demo-stream.smartqueue.vn/diamond' },
    { name: 'Highlands Mạc Đĩnh Chi', address: '39 Mạc Đĩnh Chi, Quận 1', lat: 10.7842, lng: 106.6985, maxCapacity: 50, cameraUrl: 'https://demo-stream.smartqueue.vn/macdinhchi' },
  ];

  for (const b of highlandsBranches) {
    const branch = await prisma.branch.create({
      data: { ...b, enterpriseId: highlandsEnt.id, currentLoad: Math.floor(Math.random() * 40) }
    });

    // Tạo lịch sử tải 24h qua cho đẹp biểu đồ
    for (let i = 0; i < 24; i++) {
      const ts = new Date();
      ts.setHours(ts.getHours() - i);
      await prisma.branchLoadLog.create({
        data: {
          branchId: branch.id,
          currentLoad: Math.floor(Math.random() * b.maxCapacity),
          timestamp: ts
        }
      });
    }
  }

  // 3. Tạo User khách hàng mẫu
  await prisma.user.create({
    data: {
      email: 'user@demo.com',
      password,
      name: 'Nguyễn Văn Khách',
      role: Role.USER,
    },
  });

  console.log('\n✅ Dữ liệu "Vàng" đã sẵn sàng!');
  console.log('--------------------------------------------------');
  console.log('Tài khoản test (Pass: hackathon123):');
  console.log('1. Admin: admin@smartqueue.com');
  console.log('2. Enterprise: highlands@demo.com');
  console.log('3. User: user@demo.com');
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
