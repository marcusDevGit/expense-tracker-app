import "dotenv/config";
import { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export const jwtConfig: {
  secret: string;
  expiresIn: SignOptions["expiresIn"];
} = { secret: env.jwtSecret, expiresIn: "1d" };

export const jwtRefreshToken: {
  secret: string;
  expiresIn: SignOptions["expiresIn"];
} = { secret: env.jwtRefreshSecret, expiresIn: "7d" };
