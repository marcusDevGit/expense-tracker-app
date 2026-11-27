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
            expect(expense!.description).toBe('Supermercado');
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

            prismaMock.wallet.findFirst.mockResolvedValue({ id: 'wallet-1', userId } as any);
            prismaMock.expense.findMany.mockResolvedValue([
                { id: '1', amount: new Prisma.Decimal(10) }
            ] as any);
            prismaMock.expense.count.mockResolvedValue(1);
            prismaMock.expense.findMany.mockResolvedValueOnce([]);
            prismaMock.expense.findMany.mockResolvedValueOnce([{ id: '1' }] as any);

            const result = await expenseService.listByMonth(userId, 'wallet-1', 10, 2024);

            expect(result.data).toHaveLength(1);
            expect(result.meta.total).toBe(1);
            expect(prismaMock.wallet.findFirst).toHaveBeenCalledWith({
                where: { id: 'wallet-1', userId },
            });
        });

        it('deve lançar AppError se a carteira não pertencer ao usuário', async () => {
            prismaMock.wallet.findFirst.mockResolvedValue(null);

            await expect(expenseService.listByMonth('user-1', 'other-wallet', 10, 2024))
                .rejects.toBeInstanceOf(AppError);
        });
    });

    describe('getSuggestions', () => {
        it('deve agrupar por descrição e ordenar por frequência e recência', async () => {
            const older = new Date('2026-10-01T10:00:00Z');
            const newer = new Date('2026-10-15T10:00:00Z');

            prismaMock.expense.findMany.mockResolvedValue([
                {
                    description: 'Uber',
                    amount: new Prisma.Decimal(25),
                    walletId: 'wallet-1',
                    categoryId: 'cat-transport',
                    paymentMethod: 'CREDIT_CARD',
                    expenseDate: newer,
                    category: { name: 'Transporte' },
                },
                {
                    description: 'uber',
                    amount: new Prisma.Decimal(20),
                    walletId: 'wallet-1',
                    categoryId: 'cat-transport',
                    paymentMethod: 'CREDIT_CARD',
                    expenseDate: older,
                    category: { name: 'Transporte' },
                },
                {
                    description: 'Netflix',
                    amount: new Prisma.Decimal(55.9),
                    walletId: 'wallet-1',
                    categoryId: 'cat-sub',
                    paymentMethod: 'CREDIT_CARD',
                    expenseDate: newer,
                    category: { name: 'Assinaturas' },
                },
            ] as any);

            const suggestions = await expenseService.getSuggestions('user-1', undefined, 5);

            expect(suggestions).toHaveLength(2);
            expect(suggestions[0]).toMatchObject({
                description: 'Uber',
                amount: 25,
                categoryName: 'Transporte',
                count: 2,
            });
            expect(suggestions[1]).toMatchObject({
                description: 'Netflix',
                amount: 55.9,
                count: 1,
            });
        });

        it('deve filtrar por texto e respeitar o limite informado', async () => {
            prismaMock.expense.findMany.mockResolvedValue([
                {
                    description: 'Uber Casa',
                    amount: new Prisma.Decimal(18),
                    walletId: 'wallet-1',
                    categoryId: null,
                    paymentMethod: 'PIX',
                    expenseDate: new Date('2026-10-15T10:00:00Z'),
                    category: null,
                },
                {
                    description: 'Uber Trabalho',
                    amount: new Prisma.Decimal(22),
                    walletId: 'wallet-1',
                    categoryId: null,
                    paymentMethod: 'PIX',
                    expenseDate: new Date('2026-10-14T10:00:00Z'),
                    category: null,
                },
            ] as any);

            const suggestions = await expenseService.getSuggestions('user-1', 'uber', 1);

            expect(prismaMock.expense.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {
                        wallet: { userId: 'user-1' },
                        description: { contains: 'uber', mode: 'insensitive' },
                    },
                }),
            );
            expect(suggestions).toHaveLength(1);
            expect(suggestions[0].description).toBe('Uber Casa');
        });
    });
});
