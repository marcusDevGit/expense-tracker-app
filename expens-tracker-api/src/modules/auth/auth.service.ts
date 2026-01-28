import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/database.js";
import { jwtConfig } from "../../config/jwt.js";

export class AuthService {
  async authenticate({ email, password }: any) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Email ou senha incorreto!");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Email ou senha incorreto!");
    }

    const token = jwt.sign({ sub: user.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }

  async generateToken(userId: string) {}

  async verifyToken(token: string) {}
}
