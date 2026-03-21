import { Router } from "express";
import { BranchController } from "../controllers/branch.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const branchController = new BranchController();

/**
 * @swagger
 * /api/branches:
 *   get:
 *     summary: Get all branches
 *     tags: [Branches]
 *     parameters:
 *       - in: query
 *         name: enterpriseId
 *         schema:
 *           type: integer
 *         description: Filter by enterprise ID
 *     responses:
 *       200:
 *         description: List of branches
 */
router.get("/", branchController.getAll);

/**
 * @swagger
 * /api/branches/nearby:
 *   get:
 *     summary: Get branches near a location
 *     tags: [Branches]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 5
 *         description: Radius in kilometers
 *     responses:
 *       200:
 *         description: List of nearby branches
 */
router.get("/nearby", branchController.getNearby);

/**
 * @swagger
 * /api/branches/{id}:
 *   get:
 *     summary: Get branch by ID
 *     tags: [Branches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Branch details
 */
router.get("/:id", branchController.getById);

/**
 * @swagger
 * /api/branches/geocode:
 *   get:
 *     summary: Convert address to coordinates using OpenRouteService
 *     tags: [Branches]
 *     parameters:
 *       - in: query
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Geocoding result
 */
router.get("/geocode/search", authMiddleware, branchController.geocode);

// Các route thay đổi dữ liệu cần đăng nhập (ENTERPRISE hoặc SUPERADMIN)
router.post("/", authMiddleware, roleMiddleware(['ENTERPRISE', 'SUPERADMIN']), branchController.create);
router.put("/:id", authMiddleware, roleMiddleware(['ENTERPRISE', 'SUPERADMIN']), branchController.update);
router.patch("/:id/load", branchController.updateLoad); // Endpoint cho AI thì có thể để public hoặc dùng secret key riêng

export default router;
