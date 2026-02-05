import { prisma } from "../../config/database.js";
import { ExpenseService } from "../expenses/expense.service.js";
const expenseService = new ExpenseService();
export class StatsService {
    async getDashboardData(userId, walletId, month, year) {
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
        const now = new Date();
        const isCurrentMonth = now.getMonth() + 1 === month && now.getFullYear() === year;
        const daysInMonth = new Date(year, month, 0).getDate();
        const currentDay = isCurrentMonth ? now.getDate() : daysInMonth;
        const daysRemaining = isCurrentMonth ? (daysInMonth - currentDay + 1) : 0;
        const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
        const predictedTotal = (totalExpense / currentDay) * daysInMonth;
        const categoryMap = {};
        expenses.forEach(exp => {
            const catId = exp.categoryId || "none";
            const catName = exp.category?.name || "Sem Categoria";
            const budget = Number(exp.category?.budget) || 0;
            if (!categoryMap[catId]) {
                categoryMap[catId] = { id: catId, name: catName, total: 0, budget };
            }
            categoryMap[catId].total += Number(exp.amount);
        });
        const categoryBreakdown = Object.values(categoryMap).map(cat => {
            const remaining = cat.budget - cat.total;
            const suggestedDailyLimit = daysRemaining > 0 && remaining > 0 ? (remaining / daysRemaining) : 0;
            return {
                ...cat,
                categoryId: cat.id,
                predictedTotal: Math.round(((cat.total / currentDay) * daysInMonth) * 100) / 100,
                suggestedDailyLimit: Math.round(suggestedDailyLimit * 100) / 100,
                percentage: totalExpense > 0 ? Math.round((cat.total / totalExpense) * 100) : 0,
                budgetProgress: cat.budget > 0 ? Math.round((cat.total / cat.budget) * 100) : 0
            };
        });
        const nextMonthStart = new Date(year, month, 1);
        const nextMonthEnd = new Date(year, month + 1, 0, 23, 59, 59);
        const nextMonthExpenses = await prisma.expense.findMany({
            where: {
                walletId,
                expenseDate: { gte: nextMonthStart, lte: nextMonthEnd }
            }
        });
        const recurringTemplates = await prisma.expense.findMany({
            where: { walletId, isRecurring: true }
        });
        let nextMonthTotal = nextMonthExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
        recurringTemplates.forEach(template => {
            if (template.recurrenceType === 'MONTHLY') {
                nextMonthTotal += Number(template.amount);
            }
            else if (template.recurrenceType === 'WEEKLY') {
                nextMonthTotal += Number(template.amount) * 4;
            }
            else if (template.recurrenceType === 'YEARLY' && new Date(template.expenseDate).getMonth() === nextMonthStart.getMonth()) {
                nextMonthTotal += Number(template.amount);
            }
        });
        console.log("Stats generated successfully", { totalExpense, predictedTotal, nextMonthTotal, breakdownCount: categoryBreakdown.length });
        return {
            month: {
                totalExpense,
                predictedTotal: Math.round(predictedTotal * 100) / 100,
                nextMonthTotal: Math.round(nextMonthTotal * 100) / 100,
                count: expenses.length,
                daysRemaining
            },
            categoryBreakdown
        };
    }
    async getMonthlyTrends(userId, walletId, limit = 6) {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth() - limit + 1, 1);
        const expenses = await prisma.expense.findMany({
            where: { walletId, expenseDate: { gte: startDate, lte: now } },
            select: { amount: true, expenseDate: true }
        });
        const trendsMap = {};
        for (let i = 0; i < limit; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthLabel = date.toLocaleDateString('pt-BR', { month: "short" });
            const year = date.getFullYear();
            const key = `${year}-${date.getMonth()}`;
            trendsMap[key] = {
                month: monthLabel,
                year,
                total: 0,
                sortKey: date.getTime()
            };
        }
        expenses.forEach(exp => {
            const date = new Date(exp.expenseDate);
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            if (trendsMap[key]) {
                trendsMap[key].total += Number(exp.amount);
            }
        });
        return Object.values(trendsMap)
            .sort((a, b) => a.sortKey - b.sortKey)
            .map(({ month, year, total }) => ({ month, year, total }));
    }
    async getComparisonData(userId, walletId, month, year) {
        const currentStart = new Date(year, month - 1, 1);
        const currentEnd = new Date(year, month, 0, 23, 59, 59);
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
        const percentageChange = prevTotal > 0 ? ((currentTotal - prevTotal) / prevTotal) * 100 : (currentTotal > 0 ? 100 : 0);
        return {
            currentMonth: { total: currentTotal, month, year },
            prevMonth: { total: prevTotal, month: prevMonth, year: prevYear },
            percentageChange: Math.round(percentageChange)
        };
    }
    ;
}
