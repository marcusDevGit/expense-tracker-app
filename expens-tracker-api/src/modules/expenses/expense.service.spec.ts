import { describe, it, expect } from 'vitest';
import { ExpenseService } from './expense.service.js';
import { prismaMock } from '../../../tests/setup.js';
import { AppError } from '../../shared/errors/AppError.js';
import { Prisma } from '@prisma/client';

const expenseService = new ExpenseService();

describe('ExpenseService', () => {
    describe('create', () => {
        it('deve criar uma despesa simples', async () => {
            const userId = 'user-1';
            const expenseData = {
                description: 'Supermercado',
                amount: 150.50,
                expenseDate: new Date().toISOString(),
                walletId: 'wallet-1',
                categoryId: 'cat-1'
            };

            prismaMock.wallet.findFirst.mockResolvedValue({ id: 'wallet-1' } as any);
            prismaMock.category.findFirst.mockResolvedValue({ id: 'cat-1' } as any);
            prismaMock.expense.create.mockResolvedValue({
                id: 'exp-1',
                ...expenseData,
                amount: new Prisma.Decimal(150.50),
                expenseDate: new Date(expenseData.expenseDate),
                CreatedAt: new Date(),
                updatedAt: new Date(),
            } as any);

            const expense = await expenseService.create(userId, expenseData);

            expect(expense).toHaveProperty('id');
            expect(expense.description).toBe('Supermercado');
            expect(prismaMock.expense.create).toHaveBeenCalledTimes(1);
        });

        it('deve criar despesa parcelada e gerar múltiplas parcelas', async () => {
            const userId = 'user-1';
            const expenseData = {
                description: 'iPhone',
                amount: 1000,
                expenseDate: new Date().toISOString(),
                walletId: 'wallet-1',
                categoryId: 'cat-1',
                installments: 3
            };

            prismaMock.wallet.findFirst.mockResolvedValue({ id: 'wallet-1' } as any);
            prismaMock.category.findFirst.mockResolvedValue({ id: 'cat-1' } as any);

            await expenseService.create(userId, expenseData);

            expect(prismaMock.expense.create).toHaveBeenCalledTimes(3);
        });

        it('deve lançar AppError se a carteira for inválida', async () => {
            prismaMock.wallet.findFirst.mockResolvedValue(null);

            await expect(expenseService.create('user-1', { walletId: 'inv' }))
                .rejects.toBeInstanceOf(AppError);
        });
    });

    describe('listByMonth', () => {
        it('deve listar despesas do mês e processar recorrência', async () => {
            const userId = 'user-1';

            prismaMock.expense.findMany.mockResolvedValue([
                { id: '1', amount: new Prisma.Decimal(10) }
            ] as any);
            prismaMock.expense.count.mockResolvedValue(1);
            prismaMock.expense.findMany.mockResolvedValueOnce([]);
            prismaMock.expense.findMany.mockResolvedValueOnce([{ id: '1' }] as any);

            const result = await expenseService.listByMonth(userId, 'wallet-1', 10, 2024);

            expect(result.data).toHaveLength(1);
            expect(result.meta.total).toBe(1);
        });
    });
});
