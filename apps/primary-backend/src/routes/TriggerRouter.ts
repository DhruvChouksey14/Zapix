import { Router } from "express";
import { authMiddleware } from "../middlewares/index.js";
import { fetchAvailableTriggers } from "../controllers/TriggerController.js";

const router = Router();

router.get("/", authMiddleware, fetchAvailableTriggers);

export { router as TriggerRouter };