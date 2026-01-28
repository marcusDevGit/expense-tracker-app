import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../config/database.js";
import { jwtConfig, jwtRefreshToken } from "../../config/jwt.js";

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

    const accessToken = jwt.sign({ sub: user.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });

    const refreshToken = jwt.sign({ sub: user.id }, jwtRefreshToken.secret, {
      expiresIn: jwtRefreshToken.expiresIn,
    });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: { id: user.id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    };
  }
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new Error("Refresh token invalido");
    }
    const payload = jwt.verify(
      refreshToken,
      jwtRefreshToken.secret,
    ) as JwtPayload;

    const tokenExists = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });
    if (!tokenExists) {
      throw new Error("Refresh token invalido");
    }

    const newAccessToken = jwt.sign({ sub: payload.sub }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });
    return newAccessToken;
  }
  async logout(refreshToken: string) {
    if (!refreshToken) return;
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }
}
