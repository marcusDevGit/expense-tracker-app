import { prisma } from "../../config/database.js";
import { randomUUID } from "crypto";

export class CategoryService {
  async create(userId: string, name: string, color?: string, icon?: string, budget?: number) {
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

  async listByUser(userId: string) {
    return prisma.category.findMany({
      where: { OR: [{ userId: userId }, { userId: null }] },
      orderBy: { name: "asc" },
    });
  }

  async findById(userId: string, categoryId: string) {
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

  async update(userId: string, categoryId: string, name: string, color?: string, icon?: string, budget?: number) {
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

  async delete(userId: string, categoryId: string) {
    await this.findById(userId, categoryId);
    return prisma.category.delete({
      where: { id: categoryId },
    });
  }
}
