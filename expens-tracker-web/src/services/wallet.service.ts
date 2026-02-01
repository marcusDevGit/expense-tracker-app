import { api } from "./api";

export interface Wallet {
    id: string
    name: string
    balance: number
    color: string
}

export const walletService = {
    async list() {
        const response = await api.get<Wallet[]>("/wallets")
        return response.data
    }
}