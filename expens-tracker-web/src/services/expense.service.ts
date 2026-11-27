import { api } from "./api";

export interface Expense {
    id: string
    description: string
    amount: number
    expenseDate: string
    walletId: string
    categoryId?: string | null
    newCategoryName?: string
    category: { name: string, color: string | null }
    isRecurring?: boolean
    recurrenceType?: "WEEKLY" | "MONTHLY" | "YEARLY"
    paymentMethod?: string
}
export interface ExpenseSuggestion {
    description: string
    amount: number
    walletId: string
    categoryId: string | null
    categoryName: string | null
    paymentMethod: string
    count: number
}

export interface PaginatedResponse<T> {
    data: T[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
}

export const expenseService = {
    async list(params?: { walletId?: string; month?: number; year?: number; page?: number; limit?: number; categoryId?: string }) {
        const response = await api.get<PaginatedResponse<Expense>>("expenses", { params })
        return response.data
    },

    async suggestions(params?: { q?: string; limit?: number }) {
        const response = await api.get<ExpenseSuggestion[]>("expenses/suggestions", { params })
        return response.data
    },

    async create(data: {
        description: string
        amount: number;
        expenseDate: string
        walletId: string
        categoryId?: string
        newCategoryName?: string
        isRecurring?: boolean
        recurrenceType?: "WEEKLY" | "MONTHLY" | "YEARLY"
        paymentMethod?: string
        installments: number
    }) {
        const response = await api.post<Expense>("expenses", data)
        return response.data
    },
    async delete(id: string) {
        await api.delete(`expenses/${id}`)
    }
}