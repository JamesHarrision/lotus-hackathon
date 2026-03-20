import { Router } from "express";
import { BranchController } from "../controllers/branch.controller";

const router = Router();
const branchController = new BranchController();

router.get("/", branchController.getAll);
router.get("/:id", branchController.getById);
router.post("/", branchController.create);
router.put("/:id", branchController.update);
router.patch("/:id/load", branchController.updateLoad);

export default router;
