import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { URL } from "url";
import { randomUUID } from "node:crypto";

const generateDatabaseURL = (schema: string) => {
  if (!process.env.DATABASE_URL) {
    throw new Error("please provide a database url");
  }
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.append("schema", schema);
  return url.toString();
};

const schemaId = `test-${randomUUID()}`;

const url = generateDatabaseURL(schemaId);
process.env.DATABASE_URL = url;
export const prisma = new PrismaClient({
  datasources: { db: { url } },
});

beforeAll(() => {
  execSync("npx prisma migrate deploy");
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE;`,
  );
  await prisma.$disconnect();
});
