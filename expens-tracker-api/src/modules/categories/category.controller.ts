import { Request, Response } from "express";
import { CategoryService } from "./category.service.js";
import { ApiResponse } from "../../shared/utils/ApiResponse.js";
import { AppError } from "../../shared/errors/AppError.js";

const categoryService = new CategoryService();

export class CategoryController {
  async create(req: Request, res: Response) {

    const userId = req.userId;

    if (!userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const { name, color, icon, budget } = req.body;

    if (!name) {
      throw new AppError("Nome é obrigatório", 400);
    }

    const category = await categoryService.create(userId!, name, color, icon, budget);
    return res.status(201).json(ApiResponse.success(category));
  }

  async list(req: Request, res: Response) {
    const userId = req.userId;

    if (!userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const categories = await categoryService.listByUser(userId);
    return res.json(ApiResponse.success(categories));

  }

  async show(req: Request, res: Response) {
    const userId = req.userId;

    if (!userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const { id } = req.params;

    if (!id || typeof id !== "string") {
      throw new AppError("ID da categoria inválido", 400);
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
      throw new AppError("Usuário não autenticado", 401);
    }

    const { id } = req.params;

    if (!id || typeof id !== "string") {
      throw new AppError("ID da categoria inválido", 400);
    }

    await categoryService.delete(userId, id);
    return res.status(204).send();

  }
}
