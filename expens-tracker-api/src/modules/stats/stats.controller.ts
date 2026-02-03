import { Request, Response } from "express";
import { StatsService } from "./stats.service.js";

export const statsService = new StatsService();

export class StatsController {
    async getDashboard(req: Request, res: Response) {
        try {
            const userId = req.userId
            const { walletId, month, year } = req.query

            console.log("Stats Request:", { userId, walletId, month, year })

            if (!userId) {
                console.warn("Stats Error: Unauthorized")
                return res.status(401).json({ error: "Não autorizado" })
            }

            if (!walletId || !month || !year) {
                console.warn("Stats Error: Missing parameters")
                return res.status(400).json({ error: "Parâmetros ausentes" })
            }

            const stats = await statsService.getDashboardData(
                userId,
                String(walletId),
                Number(month),
                Number(year)
            )
            return res.json(stats)
        } catch (error) {
            console.error("Stats Error:", error)
            return res.status(400).json({
                error: "Erro ao buscar estatísticas",
                details: error instanceof Error ? error.message : String(error)
            })
        }
    }
}