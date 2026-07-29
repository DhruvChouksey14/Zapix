import { Router } from "express";
import {
  createZap,
  fetchZapList,
  fetchZapWithId,
  updateZapWithId,
  deleteZapWithId,
  renameZapWithId,
  enableZapExecution,
} from "../controllers/ZapController.js";
import { authMiddleware } from "../middlewares/index.js";

const router = Router();

router.post("/", authMiddleware, createZap);
router.get("/", authMiddleware, fetchZapList);
router.get("/:zapId", authMiddleware, fetchZapWithId);
router.put("/:zapId", authMiddleware, updateZapWithId);
router.delete("/:zapId", authMiddleware, deleteZapWithId);
router.patch("/:zapId/rename", authMiddleware, renameZapWithId);
router.patch("/:zapId/enable", authMiddleware, enableZapExecution);

export { router as ZapRouter };