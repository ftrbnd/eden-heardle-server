import { PrismaClient } from '@packages/database';
import { mockReset, DeepMockProxy } from 'jest-mock-extended';

jest.mock('@packages/database/client', () => {
  const { mockDeep } = jest.requireActual('jest-mock-extended');
  return {
    __esModule: true,
    prisma: mockDeep()
  };
});

beforeEach(() => {
  mockReset(prismaMock);
});

import { prisma } from '@packages/database/client';
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
