import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app/app.js';
import { prismaMock } from '../../tests/setup.js';

vi.mock('../../src/modules/auth/auth.middleware.js', () => ({
    authMiddleware: (req: any, res: any, next: any) => {
        req.userId = 'user-integration';
        next();
    }
}));

describe('Expenses Routes (Integration)', () => {
    describe('POST /api/expenses', () => {
        it('deve criar uma nova despesa via rota', async () => {
            const expenseData = {
                description: 'Lunch',
                amount: 50.5,
                walletId: 'wallet-1',
                categoryId: 'cat-1',
                expenseDate: new Date().toISOString()
            };

            prismaMock.wallet.findFirst.mockResolvedValue({ id: 'wallet-1' } as any);
            prismaMock.category.findFirst.mockResolvedValue({ id: 'cat-1' } as any);
            prismaMock.expense.create.mockResolvedValue({
                id: 'exp-1',
                ...expenseData,
                userId: 'user-integration',
                amount: 50.5,
            } as any);

            const response = await request(app)
                .post('/api/expenses')
                .send(expenseData);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.description).toBe('Lunch');
        });
    });
});