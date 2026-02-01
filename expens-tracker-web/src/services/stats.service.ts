import { api } from "./api";

export interface DashboardStats {
    month: { total: number; count: number }
    categoryBreakdown: { name: string; total: number; color: string | null; percentage: number }[];
}

export const statsService = {
    async getDashboardStats(walletId: string, month: number, year: number) {
        const response = await api.get<DashboardStats>("/stats/dashboard", {
            params: { walletId, month, year }
        })
        return response.data
    }
}