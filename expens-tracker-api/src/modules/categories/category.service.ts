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

  async listByUser(userId: string, onlyActive = false) {
    return prisma.category.findMany({
      where: {
        OR: [{ userId: userId }, { userId: null }],
        isActive: onlyActive ? true : undefined
      },
      orderBy: { order: "asc" },
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

  async update(userId: string, categoryId: string, data: any) {
    await this.findById(userId, categoryId);
    return prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: data.name,
        color: data.color,
        icon: data.icon,
        budget: data.budget,
        isActive: data.isActive,
        order: data.order
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
