# HƯỚNG DẪN THUYẾT TRÌNH DEMO HACKATHON 🚀

Hệ thống **SwipeToHire - Smart Queue Management** đã sẵn sàng. Dưới đây là kịch bản và các lưu ý để bạn có một buổi trình diễn ấn tượng nhất với Ban giám khảo (BGK).

---

## 1. Chuẩn bị trước Demo (10 phút trước khi lên sàn)

### **A. Khởi động hệ thống**
Mở terminal tại thư mục gốc project và chạy:
```bash
npm run dev
```
*Lệnh này sẽ khởi động đồng thời: Backend (8080), AI Python (8000), và UI Frontend (5173+).*

### **B. Làm mới dữ liệu "Vàng"**
Để đảm bảo biểu đồ Analytics hiện lên đẹp nhất và các tài khoản test đúng như kịch bản:
```bash
npx prisma db seed
```

### **C. Kết nối Camera điện thoại (Live AI Vision)**
1. Cài ứng dụng **"IP Webcam"** (Android) hoặc **"iVCam"** trên điện thoại.
2. Lấy địa chỉ IP (ví dụ: `http://192.168.1.10:8080/video`).
3. Nếu địa chỉ IP khác với trong `seed.ts`, hãy vào UI mục quản lý chi nhánh để cập nhật `cameraUrl` cho **Highlands Landmark 81**.
4. Đảm bảo máy tính và điện thoại dùng chung một mạng Wifi.

---

## 2. Kịch bản Thuyết trình (5 phút)

### **Phần 1: Vấn đề & Giải pháp (30s)**
- **Nói**: "Vấn đề lớn nhất của các chuỗi F&B hiện nay là sự mất cân bằng tải. Khách hàng phải chờ 30-40p ở chi nhánh Q1, trong khi chi nhánh Q3 chỉ cách đó 2km lại đang trống bàn. SwipeToHire sử dụng AI Vision để điều tiết luồng khách hàng thời gian thực."

### **Phần 2: Trải nghiệm người dùng thông minh (2 phút)**
1. **Mở UI Khách hàng** (Login: `user@demo.com` / `hackathon123`).
2. **Chọn Highlands Coffee**: Show bản đồ với các chi nhánh.
3. **Demo AI Reroute**:
   - Chỉ vào điện thoại (đang đóng vai Camera): "AI đang đếm số người tại chi nhánh Landmark 81."
   - Bấm chọn đi tới Landmark 81.
   - **Tình huống**: Landmark 81 đang đông (hãy đưa tay trước camera để AI tăng số lượng người).
   - **AI phản hồi**: Một Modal hiện lên: *"Landmark 81 đang rất đông. Gợi ý bạn sang Bitexco (tiết kiệm 20p chờ đợi) + Tặng Voucher HIGHLANDS5K"*.
   - **Điểm nhấn**: "Hệ thống không ép buộc. Nếu khách vẫn muốn tới Landmark 81, họ có thể bấm 'Reject & Go Anyway'. Nếu đồng ý, họ nhận được Voucher."

### **Phần 3: Dashboard Doanh nghiệp & Quản trị (1.5 phút)**
1. **Login Doanh nghiệp** (`highlands@demo.com`).
2. **Analytics**: Show biểu đồ đường (Line Chart). "Doanh nghiệp có thể theo dõi tải của từng chi nhánh theo giờ để điều phối nhân viên."
3. **Login Super Admin** (`admin@smartqueue.com`).
4. **Hệ thống**: Show **Conversion Rate**. "Chúng tôi đo lường được bao nhiêu % khách hàng đã nghe theo gợi ý của AI. Đây là chỉ số quan trọng nhất để chứng minh hiệu quả kinh tế của giải pháp."

### **Phần 4: Công nghệ cốt lõi (1 phút)**
- **AI**: Computer Vision (Object Detection) đếm người real-time.
- **Thuật toán**: Multinomial Logit Model (Python) tính toán xác suất lựa chọn dựa trên: Khoảng cách, Thời gian chờ, và Khuyến mãi.
- **Real-time**: Socket.io đảm bảo dữ liệu nhảy liên tục mà không cần F5 trang web.

---

## 3. Các câu hỏi BGK thường gặp (FAQs)

- **Q: Tại sao không phải lúc nào cũng tặng Voucher?**
  - **A**: Đây là điểm tối ưu chi phí và chống spam cho doanh nghiệp. Hệ thống áp dụng 3 lớp bảo vệ:
    1. **Khoảng cách**: Chỉ tặng khi khách hàng phải đi xa thêm trên 10km.
    2. **Vị trí chi nhánh**: Hai chi nhánh phải cách nhau ít nhất 10km.
    3. **Giới hạn thời gian (Rate Limit)**: Mỗi khách hàng chỉ được nhận tối đa 1 Voucher mỗi 24 giờ để tránh việc cố tình yêu cầu điều phối để săn khuyến mãi.
- **Q: Nếu khách hàng gian lận AI?**
  - **A**: AI Vision có cơ chế lọc nhiễu và trung bình cộng theo phút để tránh việc tăng/giảm đột ngột do vật cản.
- **Q: Hệ thống có mở rộng được không?**
  - **A**: Có, cấu trúc Microservices (Node.js + Python) cho phép thêm hàng ngàn camera mà không ảnh hưởng đến tốc độ phản hồi của app khách hàng.

---

Chúc bạn tự tin và giành giải cao nhất! 🎉
