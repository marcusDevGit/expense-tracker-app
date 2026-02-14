import { Request, Response } from "express";
import { UserService } from "./user.service.js";

const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const user = await userService.create({ name, email, password });
      return res.status(201).json(user);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getProfile(req: Request, res: Response) { }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.userId!;
      const { name, email, defaultWalletId } = req.body
      const user = await userService.update(userId, { name, email, defaultWalletId });
      return res.json(user);

    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const userId = req.userId!;
      const { oldPassword, newPassword } = req.body;
      await userService.updatePassword(userId, oldPassword, newPassword);
      return res.json({ message: "Senha atualizada com sucesso!" })
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }

  async deleteProfile(req: Request, res: Response) { }
}
