import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/database.js";
import { jwtConfig, jwtRefreshToken } from "../../config/jwt.js";
import crypto from "node:crypto";
export class AuthService {
    async authenticate({ email, password }) {
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
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new Error("Refresh token invalido");
        }
        const payload = jwt.verify(refreshToken, jwtRefreshToken.secret);
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
    async logout(refreshToken) {
        if (!refreshToken)
            return;
        await prisma.refreshToken.deleteMany({
            where: { token: refreshToken },
        });
    }
    async forgotPassword(email) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return;
        const token = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        await prisma.passwordResetToken.create({
            data: {
                tokenHash,
                userId: user.id,
                expiresAt: new Date(Date.now() + 30 * 60 * 1000),
            },
        });
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        console.log(resetLink);
    }
    async resetPassword(token, newPassword) {
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const resetToken = await prisma.passwordResetToken.findFirst({
            where: {
                tokenHash,
                used: false,
                expiresAt: { gt: new Date() },
            },
            include: { user: true },
        });
        if (!resetToken) {
            throw new Error("Token invalido ou expirado");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetToken.userId },
                data: { password: hashedPassword },
            }),
            prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { used: true },
            }),
        ]);
    }
}
