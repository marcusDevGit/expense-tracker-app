import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtConfig } from "../../config/jwt.js";
import { Request, Response, NextFunction } from "express";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization?.replace("Bearer", " ");
  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "Token de autenticação não fornecido" });
  }
  try {
    const decode = jwt.verify(authHeader, jwtConfig.secret) as JwtPayload;
    req.userId = decode.sub as string;
    next();
  } catch (err: any) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
