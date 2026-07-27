import express from "express";
import { signup, signin, getUserDetails } from "../controllers/AuthController.js";
import { authMiddleware } from "../middlewares/index.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/:userId", authMiddleware, getUserDetails);

export { router as AuthRouter };