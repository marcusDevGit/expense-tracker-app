import { prisma } from "../../config/database.js";
import { Prisma } from "@prisma/client";

export class ExpenseService {
  async create(
    userId: string,
    data: {
      description: string;
      amount: number;
      expenseDate: string;
      walletId: string;
      categoryId: string;
      isRecurring: boolean;
      recurrenceType?: "WEEKLY" | "MONTHLY" | "YEARLY";
    },
  ) {
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: data.walletId,
        userId,
      },
    });
    if (!wallet) throw new Error("carteira invalida");

    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, userId },
    });
    if (!category) throw new Error("categoria invalida");

    return prisma.expense.create({
      data: {
        description: data.description,
        amount: new Prisma.Decimal(data.amount),
        expenseDate: new Date(data.expenseDate),
        isRecurring: data.isRecurring ?? false,
        recurrenceType: data.recurrenceType,
        walletId: data.walletId,
        categoryId: data.categoryId,
      },
    });
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
      if (!template.recurrenceType) continue;

      const incrementDate = (date: Date) => {
        const d = new Date(date);
        if (template.recurrenceType === "WEEKLY") d.setDate(d.getDate() + 7);
        else if (template.recurrenceType === "MONTHLY") d.setMonth(d.getMonth() + 1);
        else if (template.recurrenceType === "YEARLY") d.setFullYear(d.getFullYear() + 1);
        else return null;
        return d;
      };

      let currentDate = incrementDate(new Date(template.expenseDate));
      if (!currentDate) continue;

      while (currentDate <= today) {
        const startOfDay = new Date(currentDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(currentDate);
        endOfDay.setHours(23, 59, 59, 999);

        const existing = await prisma.expense.findFirst({
          where: {
            description: template.description,
            walletId: template.walletId,
            expenseDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        });

        if (!existing) {
          await this.create(userId, {
            description: template.description,
            amount: Number(template.amount),
            expenseDate: currentDate.toISOString(),
            walletId: template.walletId,
            categoryId: template.categoryId,
            isRecurring: false,
          });
        }

        const nextPotential = incrementDate(currentDate);
        if (!nextPotential || nextPotential <= currentDate) break;
        currentDate = nextPotential;
      }
    }
  }

  async listByMonth(
    userId: string,
    walletId: string,
    month: number,
    year: number,
  ) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    await this.processRecurring(userId);

    return prisma.expense.findMany({
      where: {
        walletId,
        expenseDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        expenseDate: "desc",
      },
    });
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
    if (!expense) throw new Error("Gasto não encontrado");
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
}
