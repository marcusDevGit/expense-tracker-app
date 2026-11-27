import crypto from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "../../config/database.js";
import { AppError } from "../../shared/errors/AppError.js";
import type { ImportExpenseItemInput } from "./data.validation.js";

export class DataService {
    async exportToCSV(userId: string) {
        const expenses = await prisma.expense.findMany({
            where: { wallet: { userId } },
            include: { category: true, wallet: true },
            orderBy: { expenseDate: "desc" }
        });

        if (expenses.length === 0) return "Data,Descrição,Valor,Categoria,Carteira\n";

        const header = "Data,Descrição,Valor,Categoria,Carteira\n";
        const rows = expenses.map(exp => {
            return `${exp.expenseDate.toISOString()},"${exp.description}",${exp.amount},"${exp.category?.name || "Sem Categoria"}","${exp.wallet.name}"`;
        }).join("\n")

        return header + rows
    }

    async panicReset(userId: string) {
        await prisma.expense.deleteMany({
            where: { wallet: { userId } }
        })
    }

    async importExpenses(
        userId: string,
        walletId: string,
        items: ImportExpenseItemInput[],
    ) {
        const wallet = await prisma.wallet.findFirst({
            where: { id: walletId, userId },
        });
        if (!wallet) {
            throw new AppError("Carteira inválida", 404);
        }

        const existingCategories = await prisma.category.findMany({
            where: { OR: [{ userId }, { userId: null }] },
            select: { id: true, name: true },
        });

        const categoryMap = new Map<string, string>();
        for (const cat of existingCategories) {
            categoryMap.set(cat.name.trim().toLowerCase(), cat.id);
        }

        const newCategoryNames = new Set<string>();
        for (const item of items) {
            const name = item.categoryName?.trim();
            if (name && !categoryMap.has(name.toLowerCase())) {
                newCategoryNames.add(name);
            }
        }

        return prisma.$transaction(async (tx) => {
            for (const name of newCategoryNames) {
                const key = name.toLowerCase();
                if (categoryMap.has(key)) continue;

                const created = await tx.category.create({
                    data: {
                        id: crypto.randomUUID(),
                        name,
                        userId,
                        color: "#136dec",
                        icon: "📁",
                    },
                });
                categoryMap.set(key, created.id);
            }

            const dataToInsert = items.map((item) => {
                const catKey = item.categoryName?.trim().toLowerCase();
                const categoryId = catKey ? (categoryMap.get(catKey) ?? null) : null;

                return {
                    description: item.description.trim(),
                    amount: new Prisma.Decimal(item.amount),
                    expenseDate: new Date(item.expenseDate),
                    walletId,
                    categoryId,
                    paymentMethod: item.paymentMethod ?? "OTHER",
                    isRecurring: false,
                    installments: 1,
                    currentInstallment: 1,
                };
            });

            const result = await tx.expense.createMany({
                data: dataToInsert,
            });

            return { importedCount: result.count };
        });
    }
}