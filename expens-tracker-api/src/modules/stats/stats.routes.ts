import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { StatsController } from "./stats.controller.js";

const router = Router()
const statsController = new StatsController()

router.get("/dashboard", authMiddleware, statsController.getDashboard.bind(statsController))
router.get("/trends", authMiddleware, statsController.getTrends.bind(statsController))
router.get("/comparison", authMiddleware, statsController.getComparison.bind(statsController))

export default router
