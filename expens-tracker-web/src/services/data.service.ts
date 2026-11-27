import { api } from "./api";

export interface ImportExpenseItem {
    description: string;
    amount: number;
    expenseDate: string;
    categoryName?: string;
    paymentMethod?: "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PIX" | "BANK_TRANSFER" | "OTHER";
}

export const dataService = {
    exportCSV: async () => {
        const response = await api.get<Blob>("data/export", { responseType: "blob" })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", "trasacoes.csv")
        document.body.appendChild(link)
        link.click()
        link.remove()
    },
    importExpenses: async (payload: { walletId: string; items: ImportExpenseItem[] }) => {
        const response = await api.post<{ importedCount: number }>("data/import", payload);
        return response.data;
    },
    resetData: async () => {
        const response = await api.post("data/reset")
        return response.data
    }
}