import { Request, Response } from "express";
import { WalletService } from "./wallet.service.js";
import { ExpenseService } from "../expenses/expense.service.js";

const walletService = new WalletService();
const expenseService = new ExpenseService();

export class WalletController {
  async list(req: Request, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }
      const wallets = await walletService.listByUser(userId);
      return res.json(wallets);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async dashboard(req: Request, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const { walletId } = req.params;

      if (!walletId || typeof walletId !== "string") {
        return res.status(400).json({ error: "ID da carteira inválido" });
      }

      const { month, year } = req.query;

      const wallet = await walletService.getWalletWithBalance(userId, walletId);

      const expenses = await expenseService.listByMonth(
        String(userId),
        String(walletId),
        Number(month),
        Number(year),
      );
      return res.json({ wallet, transactions: expenses });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
