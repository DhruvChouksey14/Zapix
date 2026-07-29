import { Router } from "express";
import { authMiddleware } from "../middlewares/index.js";
import { fetchAvailableActions } from "../controllers/ActionController.js";

const router = Router();

router.get("/", authMiddleware, fetchAvailableActions);

export { router as ActionsRouter };