import { PrismaClient } from '@prisma/client';

// hot reload kept opening new connections until supabase ran out, so reuse one
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
