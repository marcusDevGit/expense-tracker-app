import { api } from "./api";

export interface Expense {
    id: string
    description: string
    amount: number
    expenseDate: string
    category: { name: string, color: string | null }
}

export const expenseService = {
    async list(params: { walletId: string; month: number; year: number }) {
        const response = await api("/expenses", { params })
        return response.data
    }
}