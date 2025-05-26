/* ℹ️ Create a special file for Prisma Client when using server side rendering and serverless to
 avoid issues - we
 don't want a case where multiple prisma instances are created - we just need one and if there isn't one only then
 we want to create it. We do that in `db/prisma.ts`*/

import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

/* ℹ️ In production, your server process is typically started once and not hot-reloaded, so you
 don’t need to store the instance globally—each process can safely create its own instance.*/
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
