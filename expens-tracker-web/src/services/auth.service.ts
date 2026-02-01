import { api } from "./api";

export const authService = {
    async login(data: any) {
        const response = await api.post("/auth/login", data)
        return response.data
    },

    async register(data: any) {
        const response = await api.post("/users/register", data)
        return response.data
    }
}