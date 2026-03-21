
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

async function demoShowcase() {
  console.log('🎭 --- BẮT ĐẦU KỊCH BẢN DEMO HACKATHON --- 🎭');

  try {
    // 1. Lấy thông tin chi nhánh Highlands Coffee
    console.log('\n[BƯỚC 1] Doanh nghiệp Highlands Coffee đang hoạt động...');
    const entRes = await axios.get(`${BASE_URL}/enterprises`);
    const highlands = entRes.data.data.find((e: any) => e.name === 'Highlands Coffee');
    const entId = highlands.id;

    const branchesRes = await axios.get(`${BASE_URL}/branches?enterpriseId=${entId}`);
    const branches = branchesRes.data.data;
    const landmark81 = branches.find((b: any) => b.name.includes('Landmark 81'));
    const bitexco = branches.find((b: any) => b.name.includes('Bitexco'));

    console.log(`🏢 Enterprise: ${highlands.name} (ID: ${entId})`);
    console.log(`📍 Chi nhánh A: ${landmark81.name} (ID: ${landmark81.id})`);
    console.log(`📍 Chi nhánh B: ${bitexco.name} (ID: ${bitexco.id})`);

    // 2. Giả lập tình huống quá tải tại Landmark 81
    console.log('\n[BƯỚC 2] Cảnh báo: Landmark 81 đang cực kỳ đông khách! (98% load)');
    await axios.patch(`${BASE_URL}/branches/${landmark81.id}/load`, { currentLoad: 98 });
    await axios.patch(`${BASE_URL}/branches/${bitexco.id}/load`, { currentLoad: 15 });
    console.log('📢 AI Vision đã cập nhật tải thực tế lên hệ thống.');

    // 3. User yêu cầu đi đến Landmark 81
    const usersRes = await axios.get(`${BASE_URL}/users`);
    const demoUser = usersRes.data.data.find((u: any) => u.email === 'user@demo.com');
    const userId = demoUser.id;

    console.log(`\n[BƯỚC 3] Khách hàng ${demoUser.name} (ID: ${userId}) yêu cầu chỉ đường tới ${landmark81.name}...`);
    const recommendRes = await axios.post(`${BASE_URL}/routings/recommend`, {
      userId: userId,
      enterpriseId: entId,
      lat: 10.7951,
      lng: 106.7218,
      currentBranchId: landmark81.id
    });

    const rec = recommendRes.data.data;
    console.log(`🤖 AI PHẢN HỒI THÔNG MINH:`);
    console.log(`   👉 Gợi ý chuyển sang: ${rec.toBranch.name}`);
    console.log(`   ⏳ Tiết kiệm thời gian chờ: ${rec.estimatedWaitTime} phút`);
    console.log(`   🎁 Voucher tặng kèm: ${rec.incentiveGiven}`);

    // 4. Khách hàng đồng ý (Accepted)
    console.log('\n[BƯỚC 4] Khách hàng hài lòng và bấm "Accept Directive"');
    await axios.patch(`${BASE_URL}/routings/${rec.id}/status`, { status: 'ACCEPTED' });
    console.log('✅ Hệ thống ghi nhận điều phối thành công!');

    // 5. Show kết quả Dashboard
    console.log('\n[BƯỚC 5] Giám khảo xem Dashboard Super Admin...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@smartqueue.com',
      password: 'hackathon123'
    });
    const token = loginRes.data.data.token;
    const saDashboard = await axios.get(`${BASE_URL}/superadmin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('📊 THỐNG KÊ HỆ THỐNG:');
    console.log(`   - Tổng số lượt điều phối: ${saDashboard.data.data.stats.totalRoutings}`);
    console.log(`   - Tỷ lệ chuyển đổi thành công: ${saDashboard.data.data.stats.conversionRate}%`);

    console.log('\n🎉 --- KỊCH BẢN DEMO HOÀN TẤT TRƠN TRU --- 🎉');

  } catch (error: any) {
    console.error('❌ Lỗi Demo:', error.response?.data || error.message);
  }
}

demoShowcase();
