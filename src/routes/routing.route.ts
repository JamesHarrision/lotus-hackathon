import { Router } from "express";
import { RoutingController } from "../controllers/routing.controller";

const router = Router();
const routingController = new RoutingController();

// Cập nhật trạng thái điều hướng (ACCEPTED | REJECTED)
router.patch("/:routingId/status", routingController.updateStatus);

// Gửi yêu cầu tìm chi nhánh tối ưu (tự động gọi AI-Service)
router.post("/recommend", routingController.recommend);

// Lấy lịch sử điều hướng của một user
router.get("/user/:userId", routingController.getUserHistory);

export default router;
