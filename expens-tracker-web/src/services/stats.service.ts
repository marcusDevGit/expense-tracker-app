import { api } from "./api";

export interface DashboardStats {
    month: { totalExpense: number; count: number }
    categoryBreakdown: { name: string; total: number; percentage: number }[];
}

export const statsService = {
    async getDashboardStats(walletId: string, month: number, year: number) {
        const response = await api.get<DashboardStats>("/stats/dashboard", {
            params: { walletId, month, year }
        })
        return response.data
    }
}