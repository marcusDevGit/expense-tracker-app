import { api } from "./api";

export interface Expense {
    id: string
    description: string
    amount: number
    expenseDate: string
    walletId: string
    categoryId: string
    category: { name: string, color: string | null }
}

export const expenseService = {
    async list(params?: { walletId?: string; month?: number; year?: number }) {
        const response = await api.get<Expense[]>("/expenses", { params })
        return response.data
    },

    async create(data: {
        description: string
        amount: number;
        expenseDate: string
        walletId: string
        categoryId: string
    }) {
        const response = await api.post<Expense>("/expenses", data)
        return response.data
    },
    async delete(id: string) {
        await api.delete(`/expenses/${id}`)
    }
}