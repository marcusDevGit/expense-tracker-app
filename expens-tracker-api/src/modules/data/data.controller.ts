import { Request, Response } from "express";
import { DataService } from "./data.service.js"

const dataService = new DataService();

export class DataController {
    async export(req: Request, res: Response) {
        try {
            const userId = req.userId!;
            const csv = await dataService.exportToCSV(userId)

            res.setHeader("Content-type", "text/csv")
            res.setHeader("Content-Disposition", "attachment; filename=transacoes.csv");

            return res.status(200).send(csv)

        } catch (err: any) {
            return res.status(400).json({ error: err.message })
        }
    }

    async reset(req: Request, res: Response) {
        try {
            const userId = req.userId!;
            await dataService.panicReset(userId);
            return res.status(200).json({ message: "Todas as transações foram apagadas com sucesso!" });
        } catch (err: any) {
            return res.status(400).json({ error: err.message })
        }
    }
}