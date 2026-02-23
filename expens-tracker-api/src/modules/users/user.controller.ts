import { Request, Response } from "express";
import { UserService } from "./user.service.js";
import { ApiResponse } from "../../shared/utils/ApiResponse.js";

const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const user = await userService.create({ name, email, password });

    return res.status(201).json(
      ApiResponse.success(user, "usuario criado com sucesso!")
    )
  }

  async getProfile(req: Request, res: Response) { }

  async updateProfile(req: Request, res: Response) {
    const userId = req.userId!;
    const { name, email, defaultWalletId } = req.body

    const user = await userService.update(userId, { name, email, defaultWalletId });
    return res.json(ApiResponse.success(user));

  }

  async updatePassword(req: Request, res: Response) {

    const userId = req.userId!;
    const { oldPassword, newPassword } = req.body;
    await userService.updatePassword(userId, oldPassword, newPassword);

    return res.json(ApiResponse.success(null, "Senha atualizada com sucesso!"))

  }

  async deleteProfile(req: Request, res: Response) { }
}
