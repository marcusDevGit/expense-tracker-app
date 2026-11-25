import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { WalletController } from "./wallet.controller.js";
import { validate } from "../../shared/middlewares/validate.js";
import {
  createWalletSchema,
  updateWalletSchema,
  walletDashboardQuerySchema,
  walletIdParamSchema,
} from "./wallet.validation.js";

const router = Router();
const walletController = new WalletController();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Wallets
 *   description: Gerenciamento de carteiras
 */
/** 
 * @swagger
 * /wallets:
 *   post:
 *     summary: Cria uma nova carteira
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: "Carteira de Conta Corrente" }
 *               currency: { type: string, example: "BRL" }
 *               initialBalance: { type: number, example: 1000 }
 *     responses:
 *       201:
 *         description: Carteira criada com sucesso
 */
router.post("/", validate(createWalletSchema), walletController.create.bind(walletController));

/**
 * @swagger
 * /wallets:
 *   get:
 *     summary: Lista todas as carteiras
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de carteiras
 */
router.get("/", walletController.list.bind(walletController));

/**
 * @swagger
 * /wallets/{id}:
 *   get:
 *     summary: Retorna uma carteira pelo ID
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carteira encontrada
 */
router.get("/:id", validate(walletIdParamSchema, "params"), walletController.show.bind(walletController));

/**
 * @swagger
 * /wallets/{id}:
 *   put:
 *     summary: Atualiza uma carteira
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Carteira Principal" }
 *               currency: { type: string, example: "BRL" }
 *     responses:
 *       200:
 *         description: Carteira atualizada com sucesso
 */
router.put("/:id", validate(walletIdParamSchema, "params"), validate(updateWalletSchema), walletController.update.bind(walletController));

/**
 * @swagger
 * /wallets/{id}:
 *   delete:
 *     summary: Remove uma carteira
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Carteira removida com sucesso
 */
router.delete("/:id", validate(walletIdParamSchema, "params"), walletController.delete.bind(walletController));

/**
 * @swagger
 * /wallets/{id}/dashboard:
 *   get:
 *     summary: Retorna o dashboard de uma carteira
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: Dashboard da carteira
 */
router.get("/:id/dashboard", validate(walletIdParamSchema, "params"), validate(walletDashboardQuerySchema, "query"), walletController.dashboard.bind(walletController));

export default router;
