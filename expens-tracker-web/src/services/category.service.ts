import { api } from "./api";

export interface Category {
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
    budget: number | null;
    userId: string | null;
}

export const categoryService = {
    async list() {
        const response = await api.get<Category[]>("categories");
        return response.data;
    },
    async create(name: string, color?: string, icon?: string, budget?: number) {
        const response = await api.post<Category>("categories", { name, color, icon, budget })
        return response.data
    },
    async update(id: string, name: string, color?: string, icon?: string, budget?: number) {
        const response = await api.put<Category>(`categories/${id}`, { name, color, icon, budget })
        return response.data
    },
    async delete(id: string) {
        await api.delete(`categories/${id}`)
    }
};
