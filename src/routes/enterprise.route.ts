import { Router } from "express";
import { EnterpriseController } from "../controllers/enterprise.controller";

const router = Router();
const enterpriseController = new EnterpriseController();

/**
 * @swagger
 * /api/enterprises:
 *   get:
 *     summary: Get all enterprises
 *     tags: [Enterprises]
 *     responses:
 *       200:
 *         description: List of enterprises
 */
router.get("/", enterpriseController.getAll);

/**
 * @swagger
 * /api/enterprises/{id}:
 *   get:
 *     summary: Get enterprise by ID
 *     tags: [Enterprises]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Enterprise details
 */
router.get("/:id", enterpriseController.getById);

/**
 * @swagger
 * /api/enterprises/{id}/dashboard:
 *   get:
 *     summary: Get enterprise real-time dashboard data
 *     tags: [Enterprises]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Real-time load stats for all branches
 */
router.get("/:id/dashboard", enterpriseController.getDashboard);

/**
 * @swagger
 * /api/enterprises/{id}/analytics:
 *   get:
 *     summary: Get enterprise historical analytics data
 *     tags: [Enterprises]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Historical load data for charts
 */
router.get("/:id/analytics", enterpriseController.getAnalytics);
router.get("/:id/graph", enterpriseController.getGraph);
router.post("/", enterpriseController.create);
router.put("/:id", enterpriseController.update);
router.delete("/:id", enterpriseController.delete);

export default router;
