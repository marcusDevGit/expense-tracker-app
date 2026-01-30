import { prisma } from "../../config/database.js";
import { Prisma } from "@prisma/client";

export class StatsService {
  async getDashboardStats(
    userId: string,
    walletId: string,
    month: number,
    year: number,
  ) {
    // 1. Validar carteira
    const wallet = await prisma.wallet.findFirst({
      where: { id: walletId, userId },
    });
    if (!wallet) throw new Error("Carteira não encontrada");

    // Datas para filtro do mês atual
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // 2. Buscar despesas do mês
    const expenses = await prisma.expense.findMany({
      where: {
        walletId,
        expenseDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { category: true },
    });

    // 3. Calcular totais do mês
    const totalExpense = expenses.reduce(
      (acc, curr) => acc.add(curr.amount),
      new Prisma.Decimal(0),
    );

    // 4. Agrupar por categoria
    const categoryMap = new Map<
      string,
      { name: string; total: number; color: string | null }
    >();

    expenses.forEach((expense) => {
      const current = categoryMap.get(expense.categoryId) || {
        name: expense.category.name,
        total: 0,
        color: expense.category.color,
      };

      categoryMap.set(expense.categoryId, {
        ...current,
        total: current.total + Number(expense.amount),
      });
    });

    const categoryBreakdown = Array.from(categoryMap.values())
      .map((cat) => ({
        ...cat,
        percentage:
          Number(totalExpense) > 0
            ? Math.round((cat.total / Number(totalExpense)) * 100)
            : 0,
      }))
      .sort((a, b) => b.total - a.total);

    // 5. Histórico mensal (últimos 6 meses)
    const historyStart = new Date(year, month - 6, 1); // Pega 6 meses atrás
    const historyEnd = new Date(year, month + 1, 0); // Até o fim do mês atual

    const historyExpenses = await prisma.expense.groupBy({
      by: ["expenseDate"],
      where: {
        walletId,
        expenseDate: {
          gte: historyStart,
          lte: historyEnd,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Processar histórico agrupando por mês/ano em JS (Prisma não agrupa por mês nativamente sem raw)
    const monthlyHistoryMap = new Map<string, number>();

    // Inicializar últimos 6 meses com zero
    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - 1 - i, 1);
      const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
      monthlyHistoryMap.set(key, 0);
    }

    historyExpenses.forEach((item) => {
      const d = new Date(item.expenseDate);
      const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
      if (monthlyHistoryMap.has(key)) {
        const current = monthlyHistoryMap.get(key) || 0;
        monthlyHistoryMap.set(key, current + Number(item._sum.amount || 0));
      }
    });

    const monthlyHistory = Array.from(monthlyHistoryMap.entries()).map(
      ([month, total]) => ({
        month,
        total,
      }),
    );

    return {
      month: {
        totalExpense: Number(totalExpense),
        count: expenses.length,
      },
      categoryBreakdown,
      monthlyHistory,
    };
  }
}
