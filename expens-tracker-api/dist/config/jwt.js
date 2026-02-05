import "dotenv/config";
import { env } from "../config/env.js";
export const jwtConfig = { secret: env.jwtSecret, expiresIn: "1d" };
export const jwtRefreshToken = { secret: env.jwtRefreshSecret, expiresIn: "7d" };
