# Tài liệu Tích hợp Thuật toán Điều hướng (Algorithm Integration)

Tài liệu này hướng dẫn đội Algorithm cách triển khai API để nhận dữ liệu từ Backend Express và trả về kết quả gợi ý chi nhánh tối ưu.

## 1. Thông tin chung
- **Giao thức**: HTTP POST
- **URL mặc định**: `http://localhost:5000/algorithm/optimize`
- **Định dạng dữ liệu**: JSON

## 2. Dữ liệu đầu vào (Input từ Backend)
Backend sẽ gửi một "bức tranh" toàn cảnh về trạng thái hệ thống hiện tại:

```json
{
  "userId": 1,
  "userLocation": {
    "lat": 10.848,
    "lng": 106.772
  },
  "branches": [
    {
      "id": 1,
      "name": "Chi nhánh A",
      "lat": 10.7,
      "lng": 106.7,
      "currentLoad": 25,
      "maxCapacity": 100
    },
    ...
  ],
  "userToBranches": [
    {
      "branchId": 1,
      "distanceMeters": 1500,
      "durationMinutes": 5.2
    },
    ...
  ]
}
```

### Giải thích các trường:
- `userLocation`: Tọa độ GPS hiện tại của khách hàng.
- `branches`: Danh sách toàn bộ các chi nhánh của thương hiệu mà khách hàng muốn đến.
    - `currentLoad`: Số người hiện có tại chi nhánh (do AI đếm real-time).
    - `maxCapacity`: Sức chứa tối đa của chi nhánh đó.
- `userToBranches`: Ma trận khoảng cách và thời gian di chuyển **từ khách hàng đến từng chi nhánh** (đã được Backend tính toán sẵn qua OpenRouteService).

## 3. Dữ liệu đầu ra (Output mong muốn từ Algorithm)
Đội Algorithm cần tính toán dựa trên thuật toán Min-Cost Max-Flow (hoặc logic tối ưu riêng) và trả về kết quả theo format sau:

```json
{
  "recommendedBranchId": 2,
  "fromBranchId": 1,
  "cost": 15.75
}
```

### Giải thích các trường:
- `recommendedBranchId`: ID của chi nhánh mà thuật toán quyết định điều hướng khách hàng tới.
- `fromBranchId`: ID của chi nhánh gốc mà khách hàng định đến ban đầu (nếu có, nếu không lấy chi nhánh gần nhất).
- `cost`: Giá trị "chi phí" tối ưu mà thuật toán tính toán được (dùng để tracking và debug).

## 4. Gợi ý triển khai (Python/FastAPI)
Đội Algorithm có thể sử dụng FastAPI để tạo endpoint này một cách nhanh chóng:

```python
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

class Location(BaseModel):
    lat: float
    lng: float

class Branch(BaseModel):
    id: int
    currentLoad: int
    maxCapacity: int
    # ... các trường khác

class MatrixItem(BaseModel):
    branchId: int
    distanceMeters: float
    durationMinutes: float

class AlgoRequest(BaseModel):
    userId: int
    userLocation: Location
    branches: List[Branch]
    userToBranches: List[MatrixItem]

@app.post("/algorithm/optimize")
async def optimize(data: AlgoRequest):
    # --- TRIỂN KHAI THUẬT TOÁN TẠI ĐÂY ---
    # 1. Tính toán dựa trên data.userToBranches (khoảng cách)
    # 2. Tính toán dựa trên data.branches[i].currentLoad (độ đông đúc)
    # 3. Trả về recommendedBranchId tối ưu nhất
    
    return {
        "recommendedBranchId": 2,
        "fromBranchId": 1,
        "cost": 10.5
    }
```

## 5. Lưu ý
- Backend đã bọc sẵn `try-catch`. Nếu Service thuật toán lỗi hoặc timeout, Backend sẽ báo lỗi cho khách hàng.
- Hãy đảm bảo tốc độ xử lý của thuật toán < 2 giây để đảm bảo trải nghiệm người dùng.
