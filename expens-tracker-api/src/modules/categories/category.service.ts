import { prisma } from "../../config/database.js";
import { randomUUID } from "crypto";

export class CategoryService {
  async create(userId: string, name: string) {
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
        userId,
      },
    });
  }

  async listByUser(userId: string) {
    return prisma.category.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });
  }

  async findById(userId: string, categoryId: string) {
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });
    if (!category) {
      throw new Error("Categoria não encontrada");
    }
    return category;
  }

  async update(userId: string, categoryId: string, name: string) {
    await this.findById(userId, categoryId);
    return prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
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
