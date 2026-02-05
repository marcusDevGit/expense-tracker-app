import { prisma } from "../../config/database.js";
import { Decimal } from "@prisma/client/runtime/client";
export class WalletService {
    async create(userId, data) {
        return prisma.wallet.create({
            data: {
                name: data.name,
                currency: data.currency ?? "BRL",
                initialBalance: data.initialBalance,
                userId,
            },
        });
    }
    async listByUser(userId) {
        const wallets = await prisma.wallet.findMany({
            where: { userId },
            include: {
                expenses: {
                    select: {
                        amount: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        const result = [];
        return wallets.map((wallet) => {
            const balance = wallet.expenses.reduce((acc, tx) => acc.minus(tx.amount), new Decimal(wallet.initialBalance));
            const { expenses, ...walletData } = wallet;
            return {
                ...walletData,
                currentBalance: balance,
            };
        });
    }
    async getWalletWithBalance(userId, walletId) {
        const wallet = await prisma.wallet.findFirst({
            where: { id: walletId, userId },
            include: {
                expenses: {
                    select: {
                        amount: true,
                    },
                },
            },
        });
        if (!wallet) {
            throw new Error("Carteira não encontrada");
        }
        const balance = wallet.expenses.reduce((acc, tx) => acc.minus(tx.amount), new Decimal(wallet.initialBalance));
        const { expenses, ...walletData } = wallet;
        return {
            ...walletData,
            currentBalance: balance,
        };
    }
    async findById(userId, walletId) {
        const wallet = await prisma.wallet.findFirst({
            where: { id: walletId, userId },
        });
        if (!wallet) {
            throw new Error("Carteira não encontrada");
        }
        return wallet;
    }
    async update(userId, walletId, data) {
        await this.findById(userId, walletId);
        return prisma.wallet.update({
            where: { id: walletId },
            data: { name: data.name, currency: data.currency },
        });
    }
    async delete(userId, walletId) {
        await this.findById(userId, walletId);
        await prisma.wallet.delete({
            where: { id: walletId },
        });
    }
}
