import { describe, it, expect, vi } from 'vitest';
import { AuthService } from './auth.service.js';
import { prismaMock } from '../../../tests/setup.js';
import { AppError } from '../../shared/errors/AppError.js';
import bcrypt from 'bcrypt';

const authService = new AuthService();

describe('AuthService', () => {
    describe('authenticate', () => {
        it('deve autenticar um usuário com credenciais válidas', async () => {
            const credentials = { email: 'user@test.com', password: 'password123' };

            prismaMock.user.findUnique.mockResolvedValue({
                id: 'user-1',
                name: 'Test User',
                email: credentials.email,
                password: 'hashed_password',
                defaultWalletId: null,
                CreatedAt: new Date(),
                updatedAt: new Date(),
            });

            vi.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

            const response = await authService.authenticate(credentials);

            expect(response).toHaveProperty('accessToken');
            expect(response.user.email).toBe(credentials.email);
        });
        it('não deve autenticar se o e-mail não for encontrado', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            const promise = authService.authenticate({
                email: 'wrong@test.com',
                password: 'any_password'
            });

            await expect(promise).rejects.toBeInstanceOf(AppError);
            await expect(promise).rejects.toHaveProperty('statusCode', 401);
        });

        it('não deve autenticar se a senha estiver incorreta', async () => {
            prismaMock.user.findUnique.mockResolvedValue({
                id: 'user-1',
                email: 'user@test.com',
                password: 'hashed_password',
                CreatedAt: new Date(),
                updatedAt: new Date(),
            } as any);

            vi.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

            await expect(authService.authenticate({
                email: 'user@test.com',
                password: 'wrong_password'
            })).rejects.toHaveProperty('statusCode', 401);
        });
    });
});