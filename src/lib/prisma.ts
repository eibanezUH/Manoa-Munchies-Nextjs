/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/prefer-default-export */
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [
      { emit: 'stdout', level: 'query' },
      { emit: 'stdout', level: 'error' },
      { emit: 'stdout', level: 'info' },
      { emit: 'stdout', level: 'warn' },
    ],
    datasources: {
      db: {
        url: `${process.env.POSTGRES_URL_NON_POOLING}&connect_timeout=10&connection_limit=1`,
      },
    },
  });

console.log('Prisma Client initialized with URL:', process.env.POSTGRES_URL_NON_POOLING);

const connectWithRetry = async (retries = 5, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      console.log('Prisma connected to database successfully');
      return;
    } catch (error) {
      console.error(`Prisma connection attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

connectWithRetry().catch(error => {
  console.error('Failed to connect to database after retries:', error);
  process.exit(1);
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
