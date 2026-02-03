import { prisma } from "../../config/database.js";

export class StatsService {
    async getDashboardData(userId: string, walletId: string, month: number, year: number) {
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
            const cat = exp.category;
            if (!cat) return;

            if (!categoryMap[cat.name]) {
                categoryMap[cat.name] = { name: cat.name, total: 0 };
            }
            categoryMap[cat.name].total += Number(exp.amount);
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
}