import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { WalletController } from "./wallet.controller.js";

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
 * /api/wallets:
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
 *             required: [name, balance]
 *             properties:
 *               name: { type: string, example: "Carteira de Conta Corrente" }
 *               balance: { type: number, example: 1000 }
 *               color: { type: string, example: "#FF0000" }
 *     responses:
 *       201:
 *         description: Carteira criada com sucesso
 */
router.post("/", walletController.create.bind(walletController));

/**
 * @swagger
 * /api/wallets:
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

router.get("/:id", walletController.show.bind(walletController));
router.put("/:id", walletController.update.bind(walletController));
router.delete("/:id", walletController.delete.bind(walletController));

/**
 * @swagger
 * /api/wallets/{id}/dashboard:
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
router.get("/:id/dashboard", walletController.dashboard.bind(walletController));

export default router;
