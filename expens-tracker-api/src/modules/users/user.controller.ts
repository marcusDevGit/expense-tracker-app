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

  async getProfile(req: Request, res: Response) {}

  async updateProfile(req: Request, res: Response) {}

  async deleteProfile(req: Request, res: Response) {}
}
