import "dotenv/config";
import { SignOptions } from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}
export const jwtConfig: {
  secret: string;
  expiresIn: SignOptions["expiresIn"];
} = { secret: process.env.JWT_SECRET, expiresIn: "1d" };
