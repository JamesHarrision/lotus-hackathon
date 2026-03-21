import { Router } from "express";
import { SuperAdminController } from "../controllers/superadmin.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const superAdminController = new SuperAdminController();

/**
 * @swagger
 * /api/superadmin/dashboard:
 *   get:
 *     summary: Get system-wide dashboard data (Super Admin only)
 *     tags: [SuperAdmin]
 *     responses:
 *       200:
 *         description: Global system stats and traffic
 */
router.get("/dashboard", authMiddleware, roleMiddleware(['SUPERADMIN']), superAdminController.getDashboard);

export default router;
