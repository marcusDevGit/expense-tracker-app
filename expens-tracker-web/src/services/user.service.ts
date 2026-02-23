import { api } from "./api";

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    defaultWalletId?: string
}

export const userService = {
    updateProfile: async (data: Partial<UserProfile>) => {
        const response = await api.put<UserProfile>("users/profile", data)
        return response.data
    },
    updatePassword: async (data: any) => {
        const response = await api.put("users/password", data)
        return response.data
    },
    getProfile: async () => {
        const response = await api.get<UserProfile>("users/profile")
        return response.data
    }
}