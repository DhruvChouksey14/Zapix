import express from "express";
import { AuthRouter } from "./AuthRoutes.js";

const router = express.Router();

router.use("/auth", AuthRouter);


export default router;