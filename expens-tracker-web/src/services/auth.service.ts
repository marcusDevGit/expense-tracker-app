import { api } from "./api";

interface AuthResponse {
    user: any;
    token: string;
}

export const authService = {
    async login(data: any) {
        const response = await api.post<AuthResponse>("/auth/login", data)
        return response.data
    },

    async register(data: any) {
        const response = await api.post("/users/register", data)
        return response.data
    }
}