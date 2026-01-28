import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const data = await authService.authenticate({ email, password });
      return res.json(data);
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  }
  async logout(req: Request, res: Response) {
    try {
      return res
        .status(204)
        .json({ message: "Logout realizado com sucesso!" })
        .send();
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
  async refresh(req: Request, res: Response) {
    // TODO: Implementar refresh token
  }
}
