import { Request, Response } from "express";
import { StatsService } from "./stats.service.js";

const statsService = new StatsService();

export class StatsController {
  async getDashboard(req: Request, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const { walletId, month, year } = req.query;

      if (!walletId || !month || !year) {
        return res
          .status(400)
          .json({
            error: "Parâmetros walletId, month e year são obrigatórios",
          });
      }

      const stats = await statsService.getDashboardStats(
        userId,
        String(walletId),
        Number(month),
        Number(year),
      );

      return res.json(stats);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
