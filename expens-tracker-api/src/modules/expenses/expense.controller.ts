import { Request, Response } from "express";
import { ExpenseService } from "./expense.service.js";
import { ApiResponse } from "../../shared/utils/ApiResponse.js";

const expenseService = new ExpenseService();

export class ExpenseController {
  async create(req: Request, res: Response) {

    const userId = req.userId!;

    const expense = await expenseService.create(userId, req.body);
    return res.status(201).json(ApiResponse.success(expense));

  }

  async list(req: Request, res: Response) {
    const userId = req.userId!;

    const { walletId, month, year, page, limit, categoryId } = req.query;

    if (!walletId || !month || !year) {
      return res.status(400).json({ error: "Parâmetros inválidos" });
    }

    const expenses = await expenseService.listByMonth(
      userId,
      String(walletId),
      Number(month),
      Number(year),
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
      categoryId ? String(categoryId) : undefined,
    );

    return res.json(ApiResponse.success(expenses));
  }
  async show(req: Request, res: Response) {
    const userId = req.userId!;
    const { id } = req.params;

    const expense = await expenseService.findById(userId, String(id));
    return res.json(ApiResponse.success(expense));
  }

  async update(req: Request, res: Response) {
    const userId = req.userId!;
    const { id } = req.params;

    const expense = await expenseService.update(userId, String(id), req.body);
    return res.json(ApiResponse.success(expense));
  }

  async delete(req: Request, res: Response) {
    const userId = req.userId!;
    const { id } = req.params;

    await expenseService.delete(userId, String(id));
    return res.status(204).json(ApiResponse.success(null));
  }
}
