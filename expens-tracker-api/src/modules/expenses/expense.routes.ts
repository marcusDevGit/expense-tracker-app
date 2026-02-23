import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { ExpenseController } from "./expense.controller.js";

const router = Router();
const controller = new ExpenseController();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Registro e controle de gastos/despesas
 */
/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Registra uma nova despesa (Simples, Parcelada ou Recorrente)
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [description, amount, walletId, categoryId, expenseDate]
 *             properties:
 *               description: { type: string, example: 'Netflix' }
 *               amount: { type: number, example: 55.90 }
 *               walletId: { type: string }
 *               categoryId: { type: string }
 *               expenseDate: { type: string, format: date-time }
 *               installments: { type: number, description: 'Número de parcelas', example: 1 }
 *               isRecurring: { type: boolean, example: true }
 *               recurrenceType: { type: string, enum: [WEEKLY, MONTHLY, YEARLY] }
 *     responses:
 *       201:
 *         description: Despesa criada com sucesso
 */
router.post("/", controller.create.bind(controller));

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Lista todas as despesas do usuário (filtrada por mês/ano)
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema: { type: number, example: 10 }
 *       - in: query
 *         name: year
 *         required: true
 *         schema: { type: number, example: 2024 }
 *       - in: query
 *         name: walletId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: number, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: number, default: 20 }
 *     responses:
 *       200:
 *         description: Lista filtrada e paginada de despesas
 */
router.get("/", controller.list.bind(controller));

/**
 * @swagger
 * /api/expenses/{id}:
 *   get:
 *     summary: Retorna uma despesa pelo ID
 *     tags: [Expenses]
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
 *         description: Despesa encontrada
 */
router.get("/:id", controller.show.bind(controller));

/**
 * @swagger
 * /api/expenses/{id}:
 *   put:
 *     summary: Atualiza uma despesa
 *     tags: [Expenses]
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
 *               description: { type: string, example: 'Netflix' }
 *               amount: { type: number, example: 55.90 }
 *               walletId: { type: string }
 *               categoryId: { type: string }
 *               expenseDate: { type: string, format: date-time }
 *               installments: { type: number, description: 'Número de parcelas', example: 1 }
 *               isRecurring: { type: boolean, example: true }
 *               recurrenceType: { type: string, enum: [WEEKLY, MONTHLY, YEARLY] }
 *     responses:
 *       200:
 *         description: Despesa atualizada com sucesso
 */
router.put("/:id", controller.update.bind(controller));

/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     summary: Deleta uma despesa
 *     tags: [Expenses]
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
 *         description: Despesa deletada com sucesso
 */
router.delete("/:id", controller.delete.bind(controller));

export default router;
