import { PrismaClient, prisma } from '@packages/database';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// TODO: mock prisma from @packages/database
jest.mock('../src/lib/prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>()
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
