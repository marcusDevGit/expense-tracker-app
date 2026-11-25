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

    describe('findById', () => {
        it('deve retornar os dados do usuário sem expor a senha', async () => {
            const mockUser = {
                id: 'user-1',
                name: 'John Doe',
                email: 'john@example.com',
                defaultWalletId: null,
                CreatedAt: new Date(),
            };

            prismaMock.user.findUnique.mockResolvedValue(mockUser as any);

            const user = await userService.findById('user-1');

            expect(user).toEqual(mockUser);
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { id: 'user-1' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    defaultWalletId: true,
                    CreatedAt: true,
                },
            });
        });

        it('deve lançar AppError 404 quando usuário não existir', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(userService.findById('missing-id')).rejects.toMatchObject({
                statusCode: 404,
                message: 'Usuário não encontrado!',
            });
        });
    });

    describe('delete', () => {
        it('deve excluir usuário e dados dependentes em transação', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: 'user-1' } as any);
            prismaMock.$transaction.mockResolvedValue([] as any);

            await userService.delete('user-1');

            expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
            expect(prismaMock.expense.deleteMany).toHaveBeenCalledWith({
                where: { wallet: { userId: 'user-1' } },
            });
            expect(prismaMock.wallet.deleteMany).toHaveBeenCalledWith({
                where: { userId: 'user-1' },
            });
            expect(prismaMock.category.deleteMany).toHaveBeenCalledWith({
                where: { userId: 'user-1' },
            });
            expect(prismaMock.refreshToken.deleteMany).toHaveBeenCalledWith({
                where: { userId: 'user-1' },
            });
            expect(prismaMock.passwordResetToken.deleteMany).toHaveBeenCalledWith({
                where: { userId: 'user-1' },
            });
            expect(prismaMock.user.delete).toHaveBeenCalledWith({
                where: { id: 'user-1' },
            });
        });

        it('deve lançar AppError 404 ao tentar excluir usuário inexistente', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(userService.delete('missing-id')).rejects.toMatchObject({
                statusCode: 404,
                message: 'Usuário não encontrado!',
            });
            expect(prismaMock.$transaction).not.toHaveBeenCalled();
        });
    });
});