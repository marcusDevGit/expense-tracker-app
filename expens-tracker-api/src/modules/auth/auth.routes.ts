import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validate } from "../../shared/middlewares/validate.js";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from "./auth.validation.js";

const router = Router();
const authcontroller = new AuthController();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação e tokens
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, example: "user@test.com" }
 *               password: { type: string, format: password, example: "password" }
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", validate(loginSchema), authcontroller.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Realiza o logout do usuário
 *     tags: [Auth]
 *     responses:
 *       204:
 *         description: Logout realizado com sucesso
 */
router.post("/logout", authcontroller.logout);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Gera um novo access token usando o refresh token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token atualizado com sucesso
 */
router.post("/refresh", authcontroller.refresh);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Solicita link de recuperação de senha
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email, example: "user@test.com" }
 *     responses:
 *       200:
 *         description: Link de recuperação de senha enviado com sucesso
 */
router.post("/forgot-password", validate(forgotPasswordSchema), authcontroller.forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Define uma nova senha usando um token de recuperação
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token: { type: string }
 *               password: { type: string, format: password }
 *     responses:
 *       200:
 *         description: Senha recuperação com sucesso
 */
router.post("/reset-password", validate(resetPasswordSchema), authcontroller.resetPassword);

export default router;
