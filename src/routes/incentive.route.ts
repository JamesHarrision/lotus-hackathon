import { Router } from "express";
import { IncentiveController } from "../controllers/incentive.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const incentiveController = new IncentiveController();

/**
 * @swagger
 * /api/incentives:
 *   get:
 *     summary: Get all incentives
 *     tags: [Incentives]
 *     parameters:
 *       - in: query
 *         name: enterpriseId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of incentives
 */
router.get("/", incentiveController.getAll);

/**
 * @swagger
 * /api/incentives:
 *   post:
 *     summary: Create a new incentive
 *     tags: [Incentives]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [enterpriseId, code, discountVal]
 *             properties:
 *               enterpriseId: { type: integer }
 *               code: { type: string }
 *               description: { type: string }
 *               discountVal: { type: number }
 *               isPercentage: { type: boolean }
 *     responses:
 *       201:
 *         description: Incentive created
 */
router.post("/", authMiddleware, roleMiddleware(['ENTERPRISE', 'SUPERADMIN']), incentiveController.create);

/**
 * @swagger
 * /api/incentives/{id}:
 *   put:
 *     summary: Update an incentive
 *     tags: [Incentives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Incentive updated
 */
router.put("/:id", authMiddleware, roleMiddleware(['ENTERPRISE', 'SUPERADMIN']), incentiveController.update);

/**
 * @swagger
 * /api/incentives/{id}:
 *   delete:
 *     summary: Delete an incentive (Soft delete)
 *     tags: [Incentives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Incentive deleted
 */
router.delete("/:id", authMiddleware, roleMiddleware(['ENTERPRISE', 'SUPERADMIN']), incentiveController.delete);

export default router;
