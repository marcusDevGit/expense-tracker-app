import { describe, it, expect, vi } from "vitest";
import { DataService } from "./data.service.js";
import { prismaMock } from "../../../tests/setup.js";
import { AppError } from "../../shared/errors/AppError.js";

const dataService = new DataService();

describe("DataService", () => {
  describe("importExpenses", () => {
    it("deve lançar AppError 404 se a carteira não pertencer ao usuário", async () => {
      prismaMock.wallet.findFirst.mockResolvedValue(null);

      await expect(
        dataService.importExpenses("user-1", "invalid-wallet", [
          {
            description: "Café",
            amount: 12.5,
            expenseDate: "2026-11-27",
          },
        ]),
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Carteira inválida",
      });
    });

    it("deve reutilizar categorias existentes, criar novas e importar em lote", async () => {
      prismaMock.wallet.findFirst.mockResolvedValue({
        id: "wallet-1",
        userId: "user-1",
      } as any);
      prismaMock.category.findMany.mockResolvedValue([
        { id: "cat-food", name: "Alimentação" },
      ] as any);

      const txMock = {
        category: {
          create: vi.fn().mockResolvedValue({ id: "cat-new", name: "Lazer" }),
        },
        expense: {
          createMany: vi.fn().mockResolvedValue({ count: 2 }),
        },
      };

      prismaMock.$transaction.mockImplementation(async (cb: any) => cb(txMock));

      const result = await dataService.importExpenses("user-1", "wallet-1", [
        {
          description: "Almoço",
          amount: 45,
          expenseDate: "2026-11-26",
          categoryName: "alimentação",
          paymentMethod: "PIX",
        },
        {
          description: "Cinema",
          amount: 60,
          expenseDate: "2026-11-27",
          categoryName: "Lazer",
        },
      ]);

      expect(result).toEqual({ importedCount: 2 });
      expect(txMock.category.create).toHaveBeenCalledTimes(1);
      expect(txMock.expense.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({
            description: "Almoço",
            categoryId: "cat-food",
            paymentMethod: "PIX",
          }),
          expect.objectContaining({
            description: "Cinema",
            categoryId: "cat-new",
            paymentMethod: "OTHER",
          }),
        ]),
      });
    });
  });
});
