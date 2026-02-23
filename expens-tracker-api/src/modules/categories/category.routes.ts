import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { CategoryController } from "./category.controller.js";

const router = Router();
const categoryController = new CategoryController();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Categorias de gastos (Alimentação, Lazer, etc)
 */
/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Cria uma nova categoria personalizada
 *     tags: [Categories]
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
 *               name: { type: string, example: "Saúde" }
 *               color: { type: string, example: "#00FF00" }
 *               icon: { type: string, example: "🏥" }
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 */
router.post("/", categoryController.create.bind(categoryController));

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Lista as categorias do usuário e as globais
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
router.get("/", categoryController.list.bind(categoryController));

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Retorna uma categoria pelo ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria encontrada
 */
router.get("/:id", categoryController.show.bind(categoryController));

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Atualiza uma categoria
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
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
 *               name: { type: string, example: "Alimentação" }
 *               color: { type: string, example: "#FF0000" }
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 */
router.put("/:id", categoryController.update.bind(categoryController));

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Deleta uma categoria
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria deletada com sucesso
 */
router.delete("/:id", categoryController.delete.bind(categoryController));

export default router;
