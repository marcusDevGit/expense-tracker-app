import { PrismaClient } from '@prisma/client'
import { beforeEach, vi } from 'vitest'
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended'

import { prisma } from '../database.js'

vi.mock('../database.js', () => ({
    prisma: mockDeep<PrismaClient>(),
}))

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

beforeEach(() => {
    mockReset(prismaMock)
})