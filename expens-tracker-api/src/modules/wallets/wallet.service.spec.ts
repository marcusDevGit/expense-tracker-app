import { describe, it, expect } from 'vitest';
import { WalletService } from './wallet.service.js';
import { prismaMock } from '../../../tests/setup.js';
import { AppError } from '../../shared/errors/AppError.js';
import { Decimal } from '@prisma/client/runtime/client';

const walletService = new WalletService();

describe('WalletService', () => {
    describe('create', () => {
        it('deve criar uma nova carteira', async () => {
            const userId = 'user-1';
            const walletData = {
                name: 'Principal',
                initialBalance: 1000,
                currency: 'BRL'
            };

            prismaMock.wallet.create.mockResolvedValue({
                id: 'wallet-1',
                ...walletData,
                initialBalance: new Decimal(1000),
                userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            } as any);

            const wallet = await walletService.create(userId, walletData);

            expect(wallet).toHaveProperty('id');
            expect(wallet.name).toBe('Principal');
        });
    });

    describe('findById', () => {
        it('deve encontrar uma carteira por ID e usuário', async () => {
            const userId = 'user-1';
            const walletId = 'wallet-1';

            prismaMock.wallet.findFirst.mockResolvedValue({
                id: walletId,
                name: 'Principal',
                userId,
                initialBalance: new Decimal(0),
                currency: 'BRL',
                createdAt: new Date(),
                updatedAt: new Date(),
            } as any);

            const wallet = await walletService.findById(userId, walletId);

            expect(wallet.id).toBe(walletId);
        });

        it('deve lançar AppError se a carteira não for encontrada', async () => {
            prismaMock.wallet.findFirst.mockResolvedValue(null);

            await expect(walletService.findById('user-1', 'invalid-id'))
                .rejects.toBeInstanceOf(AppError);
        });
    });

    describe('listByUser', () => {
        it('deve listar carteiras com saldo calculado', async () => {
            const userId = 'user-1';

            prismaMock.wallet.findMany.mockResolvedValue([
                {
                    id: 'wallet-1',
                    name: 'Principal',
                    initialBalance: new Decimal(1000),
                    userId,
                    expenses: [{ amount: new Decimal(200) }],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            ] as any);

            const list = await walletService.listByUser(userId);

            expect(list).toHaveLength(1);
            expect(list[0].currentBalance.toNumber()).toBe(800);
        });
    });
});
