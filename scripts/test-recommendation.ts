import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

async function testRecommendation() {
  console.log('🚀 [FRONTEND] Đang gửi yêu cầu tìm chi nhánh tối ưu...');
  
  try {
    // Lưu ý: Đảm bảo userId: 1 và enterpriseId: 1 tồn tại trong Database của bạn
    // Nếu chưa có, hãy chạy script test-routing.ts trước để tạo dữ liệu mẫu.
    const response = await axios.post(`${API_URL}/routings/recommend`, {
      userId: 1,
      enterpriseId: 1,
      lat: 10.848, // Vị trí giả lập của người dùng (VD: Thủ Đức)
      lng: 106.772
    });

    if (response.data.success) {
      console.log('\n✅ [THÀNH CÔNG] Backend đã trả về kết quả điều hướng:');
      console.log('--------------------------------------------------');
      console.log('Routing ID:', response.data.data.id);
      console.log('Từ chi nhánh (ID):', response.data.data.fromBranchId);
      console.log('Đến chi nhánh tối ưu (ID):', response.data.data.toBranchId);
      console.log('Trạng thái:', response.data.data.status);
      console.log('--------------------------------------------------');
      console.log('Dữ liệu thô:', JSON.stringify(response.data.data, null, 2));
    }
  } catch (error: any) {
    console.error('\n❌ [THẤT BẠI] Lỗi khi gọi API:', error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.error('Chi tiết lỗi từ server:', error.response.data);
    }
  }
}

testRecommendation();
