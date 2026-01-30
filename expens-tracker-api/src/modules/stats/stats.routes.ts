import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { StatsController } from "./stats.controller.js";

const router = Router();
const controller = new StatsController();

router.use(authMiddleware);

router.get("/dashboard", controller.getDashboard.bind(controller));

export default router;
