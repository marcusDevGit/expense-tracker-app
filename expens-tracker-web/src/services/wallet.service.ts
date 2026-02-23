import { api } from "./api";

export interface Wallet {
    id: string
    name: string
    initialBalance: number
    currentBalance: number
    color?: string
}

export const walletService = {
    async list() {
        const response = await api.get<Wallet[]>("wallets")
        return response.data
    },
    async create(data: { name: string; color: string; initialBalance: number }) {
        const response = await api.post<Wallet>("wallets", data);
        return response.data
    },
    async delete(id: string) {
        await api.delete(`wallets/${id}`)
    }
}