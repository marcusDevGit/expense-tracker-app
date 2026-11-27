import { Request, Response } from "express";
import { DataService } from "./data.service.js";
import { ApiResponse } from "../../shared/utils/ApiResponse.js";

const dataService = new DataService();

export class DataController {
    async export(req: Request, res: Response) {
        const userId = req.userId!;
        const csv = await dataService.exportToCSV(userId);

        res.setHeader("Content-type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=transacoes.csv");

        return res.status(200).send(csv);
    }

    async reset(req: Request, res: Response) {
        const userId = req.userId!;
        await dataService.panicReset(userId);
        return res.json(ApiResponse.success(null, "Todas as transações foram apagadas com sucesso!"));
    }

    async import(req: Request, res: Response) {
        const userId = req.userId!;
        const { walletId, items } = req.body;
        const result = await dataService.importExpenses(userId, walletId, items);
        return res
            .status(201)
            .json(ApiResponse.success(result, `${result.importedCount} despesas importadas com sucesso!`));
    }
}