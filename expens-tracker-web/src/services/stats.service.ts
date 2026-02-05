import { api } from "./api";

export interface DashboardStats {
    month: {
        totalExpense: number;
        predictedTotal: number;
        nextMonthTotal: number;
        count: number;
        daysRemaining: number;
    }
    categoryBreakdown: {
        categoryId: string;
        name: string;
        total: number;
        predictedTotal: number;
        suggestedDailyLimit: number;
        percentage: number;
        budget: number;
        budgetProgress: number
    }[];
}

export interface MonthlyTrends {
    month: string;
    year: number;
    total: number;
}

export interface PeriodComparison {
    currentMonth: { total: number; month: number; year: number };
    prevMonth: { total: number; month: number; year: number };
    percentageChange: number;
}

export const statsService = {
    async getDashboardStats(walletId: string, month: number, year: number) {
        const response = await api.get<DashboardStats>("/stats/dashboard", {
            params: { walletId, month, year }
        })
        return response.data
    },

    async getTrends(walletId: string, limit: number = 6) {
        const response = await api.get<MonthlyTrends[]>('/stats/trends', { params: { walletId, limit } });
        return response.data
    },

    async getComparison(walletId: string, month: number, year: number) {
        const response = await api.get<PeriodComparison>('/stats/comparison', { params: { walletId, month, year } })
        return response.data
    }

}