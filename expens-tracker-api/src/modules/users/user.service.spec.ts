import { prismaMock } from '../../../tests/setup.js';
import { describe, it, expect } from 'vitest';
import { UserService } from './user.service.js';
import { AppError } from '../../shared/errors/AppError.js';

const userService = new UserService();

describe('UserService', () => {
    describe('create', () => {
        it('deve ser possível criar um novo usuário', async () => {
            const userInput = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            };

            prismaMock.user.findUnique.mockResolvedValue(null);
            prismaMock.user.create.mockResolvedValue({
                id: 'user-1',
                ...userInput,
                password: 'hashed_password',
                defaultWalletId: null,
                CreatedAt: new Date(),
                updatedAt: new Date(),
            });

            const user = await userService.create(userInput);

            expect(user).toHaveProperty('id');
            expect(user.email).toBe(userInput.email);
            expect(prismaMock.user.create).toHaveBeenCalled();
        });

        it('não deve ser possível criar um usuário com e-mail duplicado', async () => {
            const userInput = {
                name: 'Duplicate User',
                email: 'existing@example.com',
                password: 'password123',
            };

            prismaMock.user.findUnique.mockResolvedValue({
                id: 'existing-id',
                ...userInput,
                defaultWalletId: null,
                CreatedAt: new Date(),
                updatedAt: new Date(),
            });

            await expect(userService.create(userInput))
                .rejects
                .toBeInstanceOf(AppError);
            try {
                await userService.create(userInput);
            } catch (err: any) {
                expect(err.statusCode).toBe(409);
                expect(err.message).toBe("User já existe!");
            }
        });
    });
});