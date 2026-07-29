import express from "express";
import { AuthRouter } from "./AuthRoutes.js";
import { ZapRouter } from "./ZapRoutes.js";
import { TriggerRouter } from "./TriggerRouter.js";
import { ActionsRouter } from "./ActionRoutes.js";

const router = express.Router();

router.use("/auth", AuthRouter);
router.use("/zaps", ZapRouter);
router.use("/triggers", TriggerRouter);
router.use("/actions", ActionsRouter);

export default router;