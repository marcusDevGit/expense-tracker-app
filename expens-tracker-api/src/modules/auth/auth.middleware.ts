import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtConfig } from "../../config/jwt.js";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../shared/errors/AppError.js";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer")) {
    throw new AppError("Token de autenticação não fornecido", 401);
  }
  const token = authHeader.split(" ")[1];
  try {
    const decode = jwt.verify(token, jwtConfig.secret) as JwtPayload;
    req.userId = decode.sub as string;
    next();
  } catch {
    throw new AppError("Token inválido", 401);
  }
}
