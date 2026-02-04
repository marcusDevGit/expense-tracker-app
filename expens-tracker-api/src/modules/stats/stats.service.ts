import { prisma } from "../../config/database.js";
import { ExpenseService } from "../expenses/expense.service.js";

const expenseService = new ExpenseService();

export class StatsService {
    async getDashboardData(userId: string, walletId: string, month: number, year: number) {
        await expenseService.processRecurring(userId);

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const expenses = await prisma.expense.findMany({
            where: {
                walletId,
                expenseDate: { gte: startDate, lte: endDate }
            },
            include: { category: true }
        });

        console.log(`Found ${expenses.length} expenses for stats`);
        if (expenses.length > 0) {
            console.log("First expense category:", expenses[0].category);
        }

        const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

        const categoryMap: Record<string, { name: string, total: number }> = {};

        expenses.forEach(exp => {
            const catName = exp.category?.name || "Sem Categoria";

            if (!categoryMap[catName]) {
                categoryMap[catName] = { name: catName, total: 0 };
            }
            categoryMap[catName].total += Number(exp.amount);
        });

        const categoryBreakdown = Object.values(categoryMap).map(cat => ({
            ...cat,
            percentage: totalExpense > 0 ? Math.round((cat.total / totalExpense) * 100) : 0
        }));

        console.log("Stats generated successfully", { totalExpense, breakdownCount: categoryBreakdown.length });

        return {
            month: { totalExpense, count: expenses.length },
            categoryBreakdown
        };
    }

    async getMonthlyTrends(userId: string, walletId: string, limit: number = 6) {
        const trends = []
        const now = new Date()

        for (let i = 0; i < limit; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const month = date.getMonth() + 1;
            const year = date.getFullYear()

            const startDate = new Date(year, month - 1, 1)
            const endDate = new Date(year, month, 0, 23, 59, 59)
            const expensesAggregation = await prisma.expense.aggregate({
                where: {
                    walletId, expenseDate: { gte: startDate, lte: endDate }
                },
                _sum: { amount: true }
            })
            trends.push({
                month: date.toLocaleDateString('pt-BR', { month: "short" }),
                year,
                total: Number(expensesAggregation._sum.amount) || 0
            })
        }
        return trends
    }

    async getComparisonData(userId: string, walletId: string, month: number, year: number) {
        const currentStart = new Date(year, month - 1, 1);
        const currentEnd = new Date(year, month, 0, 23, 59, 59,)

        const prevDate = new Date(year, month - 2, 1);
        const prevMonth = prevDate.getMonth() + 1;
        const prevYear = prevDate.getFullYear();
        const prevStart = new Date(prevYear, prevMonth - 1, 1);
        const prevEnd = new Date(prevYear, prevMonth, 0, 23, 59, 59);

        const [current, prev] = await Promise.all([
            prisma.expense.aggregate({ where: { walletId, expenseDate: { gte: currentStart, lte: currentEnd } }, _sum: { amount: true } }),
            prisma.expense.aggregate({ where: { walletId, expenseDate: { gte: prevStart, lte: prevEnd } }, _sum: { amount: true } }),

        ]);
        const currentTotal = Number(current._sum.amount) || 0;
        const prevTotal = Number(prev._sum.amount) || 0;
        const percentageChange = prevTotal > 0 ? ((currentTotal - prevTotal) / prevTotal) * 100 : (currentTotal > 0 ? 100 : 0)

        return {
            currentMonth: { total: currentTotal, month, year },
            prevMonth: { total: prevTotal, month: prevMonth, year: prevYear },
            percentageChange: Math.round(percentageChange)
        }

    };

}