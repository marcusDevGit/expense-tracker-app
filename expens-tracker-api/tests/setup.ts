import { PrismaClient } from '@prisma/client'
import { beforeEach, vi } from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'

vi.mock('../src/config/database.js', () => ({
    prisma: mockDeep<PrismaClient>(),
}))

import { prisma } from '../src/config/database.js'
import { DeepMockProxy } from 'vitest-mock-extended'

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

beforeEach(() => {
    mockReset(prismaMock)
})