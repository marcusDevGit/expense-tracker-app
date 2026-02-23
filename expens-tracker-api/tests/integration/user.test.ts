import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app/app.js';
import { prismaMock } from '../../tests/setup.js';

describe('Users Routes (Integration)', () => {
    describe('POST /users', () => {
        it('deve retornar 201 ao cadastrar um novo usuário', async () => {
            const userData = {
                name: 'Integration Test',
                email: 'integration@test.com',
                password: 'password123'
            };

            prismaMock.user.findUnique.mockResolvedValue(null);
            prismaMock.user.create.mockResolvedValue({
                id: 'uuid-integration',
                ...userData,
                defaultWalletId: null,
                CreatedAt: new Date(),
                updatedAt: new Date()
            } as any);

            const response = await request(app)
                .post('/api/users/register')
                .send(userData);
            expect(response.status).toBe(201);

            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data.email).toBe(userData.email);
            expect(response.body.success).toBe(true);
        });
    });
});