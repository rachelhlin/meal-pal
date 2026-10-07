import { PrismaClient } from '@prisma/client';

// Reuse one client across hot reloads in dev so we don't exhaust DB connections.
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
