import { prisma } from "../../config/database.js";
import { Decimal } from "@prisma/client/runtime/client";

export class WalletService {
  async listByUser(userId: string) {
    const wallets = await prisma.wallet.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    const result = [];

    for (const wallet of wallets) {
      const transactions = await prisma.expense.findMany({
        where: { walletId: wallet.id },
        select: {
          amount: true,
        },
      });

      const balance = transactions.reduce((acc, tx) => {
        return acc.minus(tx.amount);
      }, new Decimal(wallet.initialBalance));

      result.push({
        ...wallet,
        currentBalance: balance,
      });
    }
    return result;
  }

  async getWalletWithBalance(userId: string, walletId: string) {
    const wallet = await prisma.wallet.findFirst({
      where: { id: walletId, userId },
    });
    if (!wallet) {
      throw new Error("Carteira não encontrada");
    }

    const transactions = await prisma.expense.findMany({
      where: { walletId },
      select: {
        amount: true,
      },
    });

    const balance = transactions.reduce((acc, tx) => {
      return acc.minus(tx.amount);
    }, new Decimal(wallet.initialBalance));

    return {
      ...wallet,
      currentBalance: balance,
    };
  }
}
