import { ExpenseService } from "./expense.service.js";
const expenseService = new ExpenseService();
export class ExpenseController {
    async create(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ error: "Usuário não autenticado" });
            }
            const expense = await expenseService.create(userId, req.body);
            return res.status(201).json(expense);
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
    async list(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ error: "Usuário não autenticado" });
            }
            const { walletId, month, year, page, limit, categoryId } = req.query;
            if (!walletId || !month || !year) {
                return res.status(400).json({ error: "Parâmetros inválidos" });
            }
            const expenses = await expenseService.listByMonth(userId, String(walletId), Number(month), Number(year), page ? Number(page) : 1, limit ? Number(limit) : 20, categoryId ? String(categoryId) : undefined);
            return res.json(expenses);
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
    async show(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ error: "Usuário não autenticado" });
            }
            const { id } = req.params;
            if (!id || typeof id !== "string") {
                return res.status(400).json({ error: "ID da despesa inválido" });
            }
            const expense = await expenseService.findById(userId, id);
            return res.json(expense);
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
    async update(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ error: "Usuário não autenticado" });
            }
            const { id } = req.params;
            if (!id || typeof id !== "string") {
                return res.status(400).json({ error: "ID da despesa inválido" });
            }
            const expense = await expenseService.update(userId, id, req.body);
            return res.json(expense);
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
    async delete(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ error: "Usuário não autenticado" });
            }
            const { id } = req.params;
            if (!id || typeof id !== "string") {
                return res.status(400).json({ error: "ID da despesa inválido" });
            }
            await expenseService.delete(userId, id);
            return res.status(204).send();
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
}
