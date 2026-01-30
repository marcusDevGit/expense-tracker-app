import { prisma } from "../../config/database.js";

export class ExpenseService {
  async listByMonth(
    userId: string,
    walletId: string,
    month: number,
    year: number,
  ) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return prisma.expense.findMany({
      where: {
        walletId,
        expenseDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        expenseDate: "desc",
      },
    });
  }
}
