import { Router } from "express";
import { UserController } from "./user.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários e perfis
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: "Marcus Phellypp" }
 *               email: { type: string, format: email, example: "marcus@test.com" }
 *               password: { type: string, format: password, example: "password123" }
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post("/register", userController.register);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Retorna o perfil do usuário logado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário
 */
router.get("/profile", authMiddleware, userController.getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Atualiza os dados do perfil
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Perfil atualizado
 */
router.put("/profile", authMiddleware, userController.updateProfile);

/**
 * @swagger
 * /api/users/password:
 *   put:
 *     summary: Altera a senha do usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 */
router.put("/password", authMiddleware, userController.updatePassword);

/**
 * @swagger
 * /api/users/profile:
 *   delete:
 *     summary: Remove a conta do usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conta removida com sucesso
 */
router.delete("/profile", authMiddleware, userController.deleteProfile);

export default router;
