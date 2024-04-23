import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

declare global {
  var prisma: PrismaClient | undefined;
}

export const databaseInstance =
  globalThis.prisma || new PrismaClient()
