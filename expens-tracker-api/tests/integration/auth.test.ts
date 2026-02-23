import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../../src/app/app.js';
import { prismaMock } from '../../tests/setup.js';
import bcrypt from 'bcrypt';

describe('Auth Routes (Integration)', () => {
    describe('POST /api/auth/login', () => {
        it('deve autenticar e devolver o token de acesso', async () => {
            const credentials = {
                email: 'marcus@test.com',
                password: 'password123'
            };

            prismaMock.user.findUnique.mockResolvedValue({
                id: 'user-123',
                name: 'Marcus Phellypp',
                email: credentials.email,
                password: 'hashed_password',
                CreatedAt: new Date(),
                updatedAt: new Date(),
            } as any);

            vi.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

            const response = await request(app)
                .post('/api/auth/login')
                .send(credentials);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data.user.email).toBe(credentials.email);
        });

        it('deve retornar 401 para credenciais inválidas', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'wrong@test.com', password: '123' });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });
});