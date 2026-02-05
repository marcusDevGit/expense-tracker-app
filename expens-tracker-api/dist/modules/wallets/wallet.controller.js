import { WalletService } from "./wallet.service.js";
import { ExpenseService } from "../expenses/expense.service.js";
const walletService = new WalletService();
const expenseService = new ExpenseService();
export class WalletController {
    async create(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ error: "Usuário não autenticado" });
            }
            const wallet = await walletService.create(userId, req.body);
            return res.status(201).json(wallet);
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
            const wallets = await walletService.listByUser(userId);
            return res.json(wallets);
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
                return res.status(400).json({ error: "ID da carteira inválido" });
            }
            const wallet = await walletService.findById(userId, id);
            return res.json(wallet);
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
                return res.status(400).json({ error: "ID da carteira inválido" });
            }
            const wallet = await walletService.update(userId, id, req.body);
            return res.json(wallet);
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
                return res.status(400).json({ error: "ID da carteira inválido" });
            }
            await walletService.delete(userId, id);
            return res.status(204).send();
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
    async dashboard(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ error: "Usuário não autenticado" });
            }
            const { id } = req.params;
            if (!id || typeof id !== "string") {
                return res.status(400).json({ error: "ID da carteira inválido" });
            }
            const { month, year } = req.query;
            const wallet = await walletService.getWalletWithBalance(userId, id);
            const expenses = await expenseService.listByMonth(userId, id, Number(month), Number(year));
            return res.json({ wallet, transactions: expenses });
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
}
