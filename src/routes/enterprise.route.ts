import { Router } from "express";
import { EnterpriseController } from "../controllers/enterprise.controller";

const router = Router();
const enterpriseController = new EnterpriseController();

router.get("/", enterpriseController.getAll);
router.get("/:id", enterpriseController.getById);
router.get("/:id/graph", enterpriseController.getGraph);
router.post("/", enterpriseController.create);
router.put("/:id", enterpriseController.update);
router.delete("/:id", enterpriseController.delete);

export default router;
