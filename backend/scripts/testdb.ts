import { prisma } from "../src/lib/prisma";

async function main() {
  try {
    console.log("Testing DB connection...");
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("Connected!", result);
  } catch (err: any) {
    console.error("Connection failed:", err.message);
    console.error("Error code:", err.errorCode);
    console.error("Full error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
