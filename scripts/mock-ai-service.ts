import express from 'express';

const app = express();
app.use(express.json());

// Endpoint giả lập cho AI Algorithm Service
app.post('/algorithm/optimize', (req, res) => {
  console.log('\n--- [MOCK AI] Nhận yêu cầu từ Backend Express ---');
  console.log('User Location:', req.body.userLocation);
  console.log('Branches:', req.body.branches.length);
  console.log('User to Branches Matrix:', JSON.stringify(req.body.userToBranches, null, 2));

  // Logic giả lập: Chọn chi nhánh cuối cùng trong danh sách và tặng voucher
  const branches = req.body.branches;
  const recommendedBranch = branches[branches.length - 1];
  const fromBranch = branches[0];

  const response = {
    recommendedBranchId: recommendedBranch.id,
    fromBranchId: fromBranch.id,
    cost: 15.75
  };

  console.log('--- [MOCK AI] Đang gửi kết quả gợi ý về Backend ---');
  console.log('Recommended Branch ID:', response.recommendedBranchId);
  res.json(response);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🤖 Mock AI Service đang chạy tại http://localhost:${PORT}`);
  console.log('Endpoint: POST /algorithm/optimize');
});
