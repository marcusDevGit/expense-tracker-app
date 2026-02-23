import { describe, it, expect } from 'vitest';
import { CategoryService } from './category.service.js';
import { prismaMock } from '../../../tests/setup.js';
import { AppError } from '../../shared/errors/AppError.js';

const categoryService = new CategoryService();

describe('CategoryService', () => {
    describe('create', () => {
        it('deve criar uma nova categoria', async () => {
            const userId = 'user-1';
            prismaMock.category.findFirst.mockResolvedValue(null);
            prismaMock.category.create.mockResolvedValue({
                id: 'cat-1',
                name: 'Comida',
                userId,
                CreatedAt: new Date(),
                updatedAt: new Date(),
            } as any);

            const category = await categoryService.create(userId, 'Comida');
            expect(category.name).toBe('Comida');
        });

        it('não deve criar categoria duplicada para o mesmo usuário', async () => {
            prismaMock.category.findFirst.mockResolvedValue({ id: 'existing' } as any);

            await expect(categoryService.create('user-1', 'Comida'))
                .rejects.toBeInstanceOf(AppError);
        });
    });

    describe('listByUser', () => {
        it('deve listar categorias do usuário e globais', async () => {
            prismaMock.category.findMany.mockResolvedValue([
                { name: 'Pessoal', userId: 'user-1' },
                { name: 'Global', userId: null }
            ] as any);

            const list = await categoryService.listByUser('user-1');
            expect(list).toHaveLength(2);
        });
    });
});