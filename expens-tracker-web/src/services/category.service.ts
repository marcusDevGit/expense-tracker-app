import { api } from "./api";

export interface Category {
    id: string;
    name: string;
    color: string | null;
}

export const categoryService = {
    async list() {
        const response = await api.get<Category[]>("/categories");
        return response.data;
    },
    async create(name: string) {
        const response = await api.post<Category>("/categories", { name })
        return response.data
    },
    async delete(id: string) {
        await api.delete(`/categories/${id}`)
    }
};
