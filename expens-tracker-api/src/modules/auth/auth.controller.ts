import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { ApiResponse } from "../../shared/utils/ApiResponse.js";

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } =
      await authService.authenticate({ email, password });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.json(ApiResponse.success({ user, accessToken }));

  }
  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    const newAccessToken = await authService.refresh(refreshToken);

    return res.json(ApiResponse.success({ accessToken: newAccessToken }));
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    await authService.logout(refreshToken);

    res.clearCookie("refreshToken");

    return res.status(204).json(ApiResponse.success(null, "Logout realizado com sucesso"));

  }
  async forgotPassword(req: Request, res: Response) {
    await authService.forgotPassword(req.body.email);
    return res.json(ApiResponse.success({
      message:
        "Se o email existir, você receberá instruções de como recuperar a senha",
    }));
  }
  async resetPassword(req: Request, res: Response) {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);

    return res.json(ApiResponse.success({ message: "Senha redefinida com sucesso" }));

  }
}
