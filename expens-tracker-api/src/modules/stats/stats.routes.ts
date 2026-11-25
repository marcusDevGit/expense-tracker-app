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

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Estatísticas e comparativos financeiros
 */

/**
 * @swagger
 * /stats/dashboard:
 *   get:
 *     summary: Retorna os dados do dashboard mensal
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: walletId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: month
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: year
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Dados estatísticos do mês
 */
router.get("/dashboard", authMiddleware, validate(dashboardStatsQuerySchema, "query"), statsController.getDashboard.bind(statsController))

/**
 * @swagger
 * /stats/trends:
 *   get:
 *     summary: Retorna a tendência mensal de gastos
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: walletId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 6 }
 *     responses:
 *       200:
 *         description: Tendência dos últimos meses
 */
router.get("/trends", authMiddleware, validate(trendsQuerySchema, "query"), statsController.getTrends.bind(statsController))

/**
 * @swagger
 * /stats/comparison:
 *   get:
 *     summary: Compara o mês atual com o mês anterior
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: walletId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: month
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: year
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Comparativo mensal
 */
router.get("/comparison", authMiddleware, validate(comparisonQuerySchema, "query"), statsController.getComparison.bind(statsController))

export default router
