import { Router } from "express";
import { RoutingController } from "../controllers/routing.controller";

const router = Router();
const routingController = new RoutingController();

/**
 * @swagger
 * /api/routings/{routingId}/status:
 *   patch:
 *     summary: Update routing status (ACCEPTED/REJECTED)
 *     tags: [Routing]
 *     parameters:
 *       - in: path
 *         name: routingId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [ACCEPTED, REJECTED] }
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch("/:routingId/status", routingController.updateStatus);

/**
 * @swagger
 * /api/routings/recommend:
 *   post:
 *     summary: Request branch recommendation for user
 *     tags: [Routing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, enterpriseId, userLat, userLng]
 *             properties:
 *               userId: { type: integer }
 *               enterpriseId: { type: integer }
 *               userLat: { type: number }
 *               userLng: { type: number }
 *     responses:
 *       200:
 *         description: Recommendation result
 */
router.post("/recommend", routingController.recommend);

/**
 * @swagger
 * /api/routings/user/{userId}:
 *   get:
 *     summary: Get routing history for a user
 *     tags: [Routing]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Routing history list
 */
router.get("/user/:userId", routingController.getUserHistory);

/**
 * @swagger
 * /api/routings:
 *   get:
 *     summary: Get all routing history (Super Admin only)
 *     tags: [Routing]
 *     responses:
 *       200:
 *         description: List of all routing events
 */
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";
router.get("/", authMiddleware, roleMiddleware(['SUPERADMIN']), routingController.getAll);

export default router;
