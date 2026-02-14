import { prisma } from "../../config/database.js"

export class DataService {
    async exportToCSV(userId: string) {
        const expenses = await prisma.expense.findMany({
            where: { wallet: { userId } },
            include: { category: true, wallet: true },
            orderBy: { expenseDate: "desc" }
        });

        if (expenses.length === 0) return "Data,Descrição,Valor,Categoria,Carteira\n";

        const header = "Data,Descrição,Varlor,Categoria,Carteira\n";
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
}