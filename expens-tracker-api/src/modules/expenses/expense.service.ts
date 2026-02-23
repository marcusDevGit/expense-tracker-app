import { prisma } from "../../config/database.js";
import { Prisma } from "@prisma/client";
import crypto from "crypto";
import { AppError } from "../../shared/errors/AppError.js";

export class ExpenseService {
  async create(
    userId: string,
    data: any) {
    const wallet = await prisma.wallet.findFirst({
      where: { id: data.walletId, userId },
    });
    if (!wallet) throw new AppError("Carteira inválida", 404);

    const categoryId = await this.getOrCreateCategory(userId, data.categoryId, data.newCategoryName);
    const installmentsCount = data.installments || 1;

    return this.createInstallments({ ...data, categoryId, installmentsCount });
  }

  async processRecurring(userId: string) {
    const today = new Date();

    const recurringTemplates = await prisma.expense.findMany({
      where: {
        isRecurring: true,
        wallet: { userId },
      },
    });

    for (const template of recurringTemplates) {
      await this.processTemplate(userId, template, today)
    }
  }

  async listByMonth(
    userId: string,
    walletId: string,
    month: number,
    year: number,
    page: number = 1,
    limit: number = 20,
    categoryId?: string,
  ) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    await this.processRecurring(userId);

    const skip = (page - 1) * limit;

    const where: Prisma.ExpenseWhereInput = {
      walletId,
      expenseDate: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: { expenseDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.expense.count({ where }),
    ]);
    return { data: expenses, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }
  async findById(userId: string, expenseId: string) {
    const expense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        wallet: {
          userId,
        },
      },
    });
    if (!expense) throw new AppError("Gasto não encontrado", 404);
    return expense;
  }

  async update(
    userId: string,
    expenseId: string,
    data: Partial<{
      description: string;
      amount: number;
      expenseDate: string;
      walletId: string;
      categoryId: string;
    }>,
  ) {
    await this.findById(userId, expenseId);

    return prisma.expense.update({
      where: {
        id: expenseId,
      },
      data: {
        ...data,
        amount: data.amount ? new Prisma.Decimal(data.amount) : undefined,
        expenseDate: data.expenseDate ? new Date(data.expenseDate) : undefined,
      },
    });
  }

  async delete(userId: string, expenseId: string) {
    await this.findById(userId, expenseId);

    return prisma.expense.delete({
      where: { id: expenseId },
    });
  }

  private async getOrCreateCategory(userId: string, categoryId?: string, newCategoryName?: string) {
    if (newCategoryName) {
      const newCategory = await prisma.category.create({
        data: {
          id: crypto.randomUUID(),
          name: newCategoryName,
          userId,
          color: "#000000",
          icon: "📁"
        },
      });
      return newCategory.id;
    }
    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: categoryId, OR: [{ userId }, { userId: null }] },
      });
      if (!category) throw new AppError("Categoria inválida", 404);
      return categoryId;
    }
    return null;
  }

  private async createInstallments(data: any) {
    const { installmentsCount, description, amount, expenseDate, isRecurring, recurrenceType, paymentMethod, walletId, categoryId } = data;
    let firstExpense;
    for (let i = 0; i < installmentsCount; i++) {
      const date = new Date(expenseDate);
      date.setMonth(date.getMonth() + i);
      const expense = await prisma.expense.create({
        data: {
          description: installmentsCount > 1 ? `${description} (${i + 1}/${installmentsCount})` : description,
          amount: new Prisma.Decimal(amount),
          expenseDate: date,
          isRecurring: isRecurring ?? false,
          recurrenceType,
          paymentMethod: paymentMethod || "CASH",
          installments: installmentsCount,
          currentInstallment: i + 1,
          walletId,
          categoryId,
        },
      });
      if (i === 0) firstExpense = expense;
    }
    return firstExpense;
  }

  private async processTemplate(userId: string, template: any, today: Date) {
    if (!template.recurrenceType) return;
    let currentDate = this.calculateNextDate(new Date(template.expenseDate), template.recurrenceType);
    if (!currentDate) return;

    while (currentDate <= today) {
      const startOfDay = new Date(currentDate); startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(currentDate); endOfDay.setHours(23, 59, 59, 999);

      const existing = await prisma.expense.findFirst({
        where: { description: template.description, walletId: template.walletId, expenseDate: { gte: startOfDay, lte: endOfDay } },
      });

      if (!existing) {
        await this.create(userId, {
          description: template.description, amount: Number(template.amount),
          expenseDate: currentDate.toISOString(), walletId: template.walletId,
          categoryId: template.categoryId, isRecurring: false,
        });
      }
      const nextPotential = this.calculateNextDate(currentDate, template.recurrenceType);
      if (!nextPotential || nextPotential <= currentDate) break;
      currentDate = nextPotential;
    }
  }

  private calculateNextDate(date: Date, type: string) {
    const d = new Date(date);
    if (type === "WEEKLY") d.setDate(d.getDate() + 7);
    else if (type === "MONTHLY") d.setMonth(d.getMonth() + 1);
    else if (type === "YEARLY") d.setFullYear(d.getFullYear() + 1);
    else return null;
    return d;
  }
}
