
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

async function testRecommendationFlow() {
  console.log('🧪 Bắt đầu kiểm thử luồng Điều phối (Crowded Scenario)...');

  try {
    // 1. Lấy danh sách chi nhánh của Highlands (ID 9)
    console.log('\n--- 1. Lấy thông tin chi nhánh ---');
    const branchesRes = await axios.get(`${BASE_URL}/branches?enterpriseId=9`);
    const branches = branchesRes.data.data;
    const branch1 = branches[0]; // Landmark 81 (ID 13)
    const branch2 = branches[1]; // Bitexco (ID 14)

    console.log(`Chi nhánh 1: ${branch1.name} (ID: ${branch1.id}) - Tải: ${branch1.currentLoad}/${branch1.maxCapacity}`);
    console.log(`Chi nhánh 2: ${branch2.name} (ID: ${branch2.id}) - Tải: ${branch2.currentLoad}/${branch2.maxCapacity}`);

    // 2. Giả lập Chi nhánh 1 cực kỳ đông (95% load)
    console.log('\n--- 2. Giả lập chi nhánh 1 quá tải ---');
    await axios.patch(`${BASE_URL}/branches/${branch1.id}/load`, { currentLoad: Math.floor(branch1.maxCapacity * 0.95) });
    
    // Giả lập Chi nhánh 2 vắng (10% load)
    await axios.patch(`${BASE_URL}/branches/${branch2.id}/load`, { currentLoad: Math.floor(branch2.maxCapacity * 0.1) });
    console.log('✅ Đã cập nhật tải thực tế.');

    // 3. User yêu cầu đi đến Chi nhánh 1
    console.log(`\n--- 3. User yêu cầu đi đến ${branch1.name} ---`);
    const recommendRes = await axios.post(`${BASE_URL}/routings/recommend`, {
      userId: 8,
      enterpriseId: 9,
      lat: branch1.lat, // User đang ở gần Landmark 81
      lng: branch1.lng,
      currentBranchId: branch1.id
    });

    const recommendation = recommendRes.data.data;
    console.log(`🤖 AI Suggestion:`);
    console.log(`   - Từ: ${recommendation.fromBranch.name}`);
    console.log(`   - Đến: ${recommendation.toBranch.name}`);
    console.log(`   - Thời gian chờ dự kiến: ${recommendation.estimatedWaitTime} phút`);
    console.log(`   - Voucher tặng kèm: ${recommendation.incentiveGiven || 'Không có'}`);

    if (recommendation.toBranchId !== branch1.id) {
      console.log('✅ Thành công: AI đã đề xuất chi nhánh khác vắng hơn!');
    } else {
      console.log('ℹ️ AI vẫn giữ nguyên chi nhánh cũ (có thể do khoảng cách quá xa hoặc utility vẫn cao hơn).');
    }

    // 4. Test User REJECT (Muốn đi tiếp đến Landmark 81 dù đông)
    console.log('\n--- 4. Test User REJECT (Vẫn muốn tới chỗ cũ) ---');
    const rejectRes = await axios.patch(`${BASE_URL}/routings/${recommendation.id}/status`, { status: 'REJECTED' });
    console.log('✅ Status updated to:', rejectRes.data.data.status);

    // 5. Kiểm tra Dashboard Super Admin thấy Conversion Rate giảm
    console.log('\n--- 5. Kiểm tra Super Admin Dashboard Stats ---');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@smartqueue.com',
      password: 'hackathon123'
    });
    const token = loginRes.data.data.token;
    const dashboardRes = await axios.get(`${BASE_URL}/superadmin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Conversion Rate hiện tại:', dashboardRes.data.data.stats.conversionRate, '%');

    console.log('\n✨ KIỂM THỬ LUỒNG ĐIỀU PHỐI HOÀN TẤT! ✨');

  } catch (error: any) {
    console.error('❌ Lỗi kiểm thử:', error.response?.data || error.message);
  }
}

testRecommendationFlow();
