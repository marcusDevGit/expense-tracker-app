import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } =
        await authService.authenticate({ email, password });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      return res.json({ user, accessToken });
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  }
  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const newAccessToken = await authService.refresh(refreshToken);

      return res.json({ accessToken: newAccessToken });
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;

      await authService.logout(refreshToken);

      res.clearCookie("refreshToken");

      return res.sendStatus(204);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
  async forgotPassword(req: Request, res: Response) {
    try {
      await authService.forgotPassword(req.body.email);
      return res.json({
        message:
          "Se o email existir, você receberá instruções de como recuperar a senha",
      });
    } catch {
      return res.sendStatus(500);
    }
  }
  async resetPassword(req: Request, res: Response) {
    try {
      const { token, password } = req.body;
      await authService.resetPassword(token, password);

      return res.json({ message: "Senha redefinida com sucesso" });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
