import { Request, Response } from "express";
import { StatsService } from "./stats.service.js";
import { ApiResponse } from "../../shared/utils/ApiResponse.js";

export const statsService = new StatsService();

export class StatsController {
  async getDashboard(req: Request, res: Response) {
    const userId = req.userId!;
    const { walletId, month, year } = req.query;

    if (!walletId || !month || !year) {
      return res.status(400).json({ error: "Parâmetros ausentes" });
    }

    const stats = await statsService.getDashboardData(
      userId,
      String(walletId),
      Number(month),
      Number(year)
    );
    return res.json(ApiResponse.success(stats));
  }

  async getTrends(req: Request, res: Response) {
    const { walletId, limit } = req.query;
    const trends = await statsService.getMonthlyTrends(
      req.userId!,
      String(walletId),
      limit ? Number(limit) : 6
    );
    return res.json(ApiResponse.success(trends));
  }

  async getComparison(req: Request, res: Response) {
    const { walletId, month, year } = req.query;
    const comparison = await statsService.getComparisonData(
      req.userId!,
      String(walletId),
      Number(month),
      Number(year)
    );
    return res.json(ApiResponse.success(comparison));
  }
}
