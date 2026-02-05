import { prisma } from "../../config/database.js";
import { randomUUID } from "crypto";
export class CategoryService {
    async create(userId, name, color, icon, budget) {
        const existingCategory = await prisma.category.findFirst({
            where: {
                name,
                userId,
            },
        });
        if (existingCategory) {
            throw new Error("Categoria já existe");
        }
        return prisma.category.create({
            data: {
                id: randomUUID(),
                name,
                color,
                icon,
                budget,
                userId,
            },
        });
    }
    async listByUser(userId) {
        return prisma.category.findMany({
            where: { OR: [{ userId: userId }, { userId: null }] },
            orderBy: { name: "asc" },
        });
    }
    async findById(userId, categoryId) {
        const category = await prisma.category.findFirst({
            where: {
                id: categoryId,
                OR: [{ userId }, { userId: null }],
            },
        });
        if (!category) {
            throw new Error("Categoria não encontrada");
        }
        return category;
    }
    async update(userId, categoryId, name, color, icon, budget) {
        await this.findById(userId, categoryId);
        return prisma.category.update({
            where: {
                id: categoryId,
            },
            data: {
                name,
                color,
                icon,
                budget,
            },
        });
    }
    async delete(userId, categoryId) {
        await this.findById(userId, categoryId);
        return prisma.category.delete({
            where: { id: categoryId },
        });
    }
}
