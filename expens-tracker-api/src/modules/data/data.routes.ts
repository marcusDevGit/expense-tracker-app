import { Router } from "express";
import { DataController } from "./data.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { validate } from "../../shared/middlewares/validate.js";
import { importExpensesSchema } from "./data.validation.js";

const router = Router();
const dataController = new DataController();

/**
 * @swagger
 * tags:
 *   name: Data
 *   description: Exportação e limpeza de dados do usuário
 */

/**
 * @swagger
 * /data/export:
 *   get:
 *     summary: Exporta todas as despesas do usuário em CSV
 *     tags: [Data]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Arquivo CSV gerado
 */
router.get("/export", authMiddleware, dataController.export);

/**
 * @swagger
 * /data/reset:
 *   post:
 *     summary: Apaga todas as transações do usuário
 *     tags: [Data]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transações apagadas com sucesso
 */
router.post("/reset", authMiddleware, dataController.reset);

/**
 * @swagger
 * /data/import:
 *   post:
 *     summary: Importa despesas em lote a partir de colunas mapeadas
 *     tags: [Data]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [walletId, items]
 *     responses:
 *       201:
 *         description: Despesas importadas com sucesso
 */
router.post("/import", authMiddleware, validate(importExpensesSchema), dataController.import);

export default router;