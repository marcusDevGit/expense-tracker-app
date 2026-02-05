import { StatsService } from "./stats.service.js";
export const statsService = new StatsService();
export class StatsController {
    async getDashboard(req, res) {
        try {
            const userId = req.userId;
            const { walletId, month, year } = req.query;
            if (!userId) {
                return res.status(400).json({ error: "Não autorizado" });
            }
            if (!walletId || !month || !year) {
                return res.status(400).json({ error: "Parâmetros ausentes" });
            }
            const stats = await statsService.getDashboardData(userId, String(walletId), Number(month), Number(year));
            return res.json(stats);
        }
        catch (error) {
            return res.status(400).json({
                error: "Erro ao buscar estatísticas",
                details: error instanceof Error ? error.message : String(error)
            });
        }
    }
    async getTrends(req, res) {
        try {
            const { walletId, limit } = req.query;
            const trends = await statsService.getMonthlyTrends(req.userId, String(walletId), limit ? Number(limit) : 6);
            return res.json(trends);
        }
        catch (error) {
            return res.status(400).json({ error: "Erro ao buscar tendências" });
        }
    }
    async getComparison(req, res) {
        try {
            const { walletId, month, year } = req.query;
            const comparison = await statsService.getComparisonData(req.userId, String(walletId), Number(month), Number(year));
            return res.json(comparison);
        }
        catch (error) {
            return res.status(400).json({ error: "Erro ao buscar comparação" });
        }
    }
}
