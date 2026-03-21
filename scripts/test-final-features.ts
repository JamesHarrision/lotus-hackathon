
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

async function testNewAPIs() {
  console.log('🚀 Bắt đầu kiểm thử các API mới...');

  try {
    // 1. Đăng nhập để lấy token (Admin)
    console.log('\n--- 1. Kiểm tra Login Admin ---');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@smartqueue.com',
      password: 'hackathon123'
    });
    const token = loginRes.data.data.token;
    console.log('✅ Login thành công. Token đã sẵn sàng.');

    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    // 2. Kiểm tra Super Admin Dashboard
    console.log('\n--- 2. Kiểm tra Super Admin Dashboard ---');
    const saDashboard = await axios.get(`${BASE_URL}/superadmin/dashboard`, authHeader);
    console.log('✅ Dữ liệu Super Admin Dashboard:', JSON.stringify(saDashboard.data.data.stats, null, 2));
    console.log('✅ Traffic 7 ngày qua:', saDashboard.data.data.systemTraffic.length, 'điểm dữ liệu.');

    // 3. Kiểm tra Enterprise Analytics (Highlands - ID 9)
    console.log('\n--- 3. Kiểm tra Enterprise Analytics (ID: 9) ---');
    const analytics = await axios.get(`${BASE_URL}/enterprises/9/analytics`, authHeader);
    console.log('✅ Tên Enterprise:', analytics.data.data.enterpriseName);
    console.log('✅ Dữ liệu chuỗi thời gian 24h:', analytics.data.data.timeSeries.length, 'giờ.');
    if (analytics.data.data.timeSeries.length > 0) {
      console.log('✅ Ví dụ dữ liệu giờ đầu tiên:', analytics.data.data.timeSeries[0]);
    }

    // 4. Kiểm tra Incentive Store
    console.log('\n--- 4. Kiểm tra Incentive Store ---');
    const incentives = await axios.get(`${BASE_URL}/incentives?enterpriseId=9`);
    console.log('✅ Danh sách Incentive của Highlands:', incentives.data.data.map((i: any) => i.code));

    // 5. Kiểm tra Luồng Recommendation kèm Incentive tự động
    console.log('\n--- 5. Kiểm tra Recommendation + Incentive ---');
    // Giả sử user đang ở Landmark 81 (ID 13) nhưng chi nhánh này đang quá tải (giả lập)
    const recommendRes = await axios.post(`${BASE_URL}/routings/recommend`, {
      userId: 8, // user@gmail.com
      enterpriseId: 9, // Highlands
      lat: 10.7951,
      lng: 106.7218,
      currentBranchId: 13
    });

    console.log('✅ Đề xuất chi nhánh:', recommendRes.data.data.toBranchId);
    console.log('✅ Thời gian chờ ước tính:', recommendRes.data.data.estimatedWaitTime, 'phút');
    if (recommendRes.data.data.incentiveGiven) {
      console.log('✅ VOUCHER TỰ ĐỘNG CẤP:', recommendRes.data.data.incentiveGiven);
    } else {
      console.log('ℹ️ Không có voucher (có thể do đề xuất chính là chi nhánh hiện tại)');
    }

    console.log('\n✨ TẤT CẢ KIỂM THỬ HOÀN TẤT THÀNH CÔNG! ✨');

  } catch (error: any) {
    console.error('❌ Lỗi kiểm thử:', error.response?.data || error.message);
  }
}

testNewAPIs();
