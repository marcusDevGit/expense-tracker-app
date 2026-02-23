import { Request, Response } from "express";
import { WalletService } from "./wallet.service.js";
import { ExpenseService } from "../expenses/expense.service.js";
import { ApiResponse } from "../../shared/utils/ApiResponse.js";

const walletService = new WalletService();
const expenseService = new ExpenseService();

export class WalletController {
  async create(req: Request, res: Response) {
    const userId = req.userId!;
    const wallet = await walletService.create(userId, req.body);
    return res.status(201).json(ApiResponse.success(wallet));
  }

  async list(req: Request, res: Response) {
    const userId = req.userId!;
    const wallets = await walletService.listByUser(userId);
    return res.json(ApiResponse.success(wallets));
  }

  async show(req: Request, res: Response) {
    const userId = req.userId!;
    const { id } = req.params;

    const wallet = await walletService.findById(userId, String(id));
    return res.json(ApiResponse.success(wallet));
  }

  async update(req: Request, res: Response) {
    const userId = req.userId!;
    const { id } = req.params;

    const wallet = await walletService.update(userId, String(id), req.body);
    return res.json(ApiResponse.success(wallet));
  }

  async delete(req: Request, res: Response) {
    const userId = req.userId!;
    const { id } = req.params;

    await walletService.delete(userId, String(id));
    return res.status(204).json(ApiResponse.success(null));
  }

  async dashboard(req: Request, res: Response) {
    const userId = req.userId!;
    const { id } = req.params;
    const { month, year } = req.query;

    const wallet = await walletService.getWalletWithBalance(userId, String(id));

    const expenses = await expenseService.listByMonth(
      userId,
      String(id),
      Number(month),
      Number(year),
    );
    return res.json(ApiResponse.success({ wallet, transactions: expenses }));
  }
}
