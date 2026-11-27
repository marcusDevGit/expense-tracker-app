import { Request, Response } from "express";
import { ExpenseService } from "./expense.service.js";
import { ApiResponse } from "../../shared/utils/ApiResponse.js";
import { AppError } from "../../shared/errors/AppError.js";

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
      throw new AppError("Parâmetros inválidos", 400);
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

  async suggestions(req: Request, res: Response) {
    const userId = req.userId!;
    const { q, limit } = req.query;

    const suggestions = await expenseService.getSuggestions(
      userId,
      q ? String(q) : undefined,
      limit ? Number(limit) : 5,
    );

    return res.json(ApiResponse.success(suggestions));
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
    return res.status(204).send();
  }
}
