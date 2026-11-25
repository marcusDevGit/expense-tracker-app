import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { StatsController } from "./stats.controller.js";
import { validate } from "../../shared/middlewares/validate.js";
import {
  comparisonQuerySchema,
  dashboardStatsQuerySchema,
  trendsQuerySchema,
} from "./stats.validation.js";

const router = Router()
const statsController = new StatsController()

router.get("/dashboard", authMiddleware, validate(dashboardStatsQuerySchema, "query"), statsController.getDashboard.bind(statsController))
router.get("/trends", authMiddleware, validate(trendsQuerySchema, "query"), statsController.getTrends.bind(statsController))
router.get("/comparison", authMiddleware, validate(comparisonQuerySchema, "query"), statsController.getComparison.bind(statsController))

export default router
