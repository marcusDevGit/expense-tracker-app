import { Request, Response } from "express";
import { CategoryService } from "./category.service.js";
import { ApiResponse } from "../../shared/utils/ApiResponse.js";

const categoryService = new CategoryService();

export class CategoryController {
  async create(req: Request, res: Response) {

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const { name, color, icon, budget } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Nome é obrigatório" });
    }

    const category = await categoryService.create(userId!, name, color, icon, budget);
    return res.status(201).json(ApiResponse.success(category));
  }

  async list(req: Request, res: Response) {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const categories = await categoryService.listByUser(userId);
    return res.json(ApiResponse.success(categories));

  }

  async show(req: Request, res: Response) {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "ID da categoria inválido" });
    }

    const category = await categoryService.findById(userId, id);
    return res.json(ApiResponse.success(category));

  }

  async update(req: Request, res: Response) {
    const userId = req.userId!;
    const { id } = req.params;
    const { name, color, icon, budget, isActive, order } = req.body;

    const category = await categoryService.update(userId, id as string, { name, color, icon, budget, isActive, order });
    return res.json(ApiResponse.success(category));

  }

  async delete(req: Request, res: Response) {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "ID da categoria inválido" });
    }

    await categoryService.delete(userId, id);
    return res.status(204).json(ApiResponse.success(null, "Categoria deletada com sucesso"));

  }
}
