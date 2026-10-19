import dotenv from "dotenv";
dotenv.config();

import { prisma } from "../src/lib/prisma";

const sampleTables = [
  { tableNo: "T-01", capacity: 2, isAvailable: true },
  { tableNo: "T-02", capacity: 6, isAvailable: true },
  { tableNo: "T-03", capacity: 4, isAvailable: false },
  { tableNo: "T-04", capacity: 4, isAvailable: true },
  { tableNo: "T-05", capacity: 2, isAvailable: true },
  { tableNo: "T-06", capacity: 8, isAvailable: false },
  { tableNo: "T-07", capacity: 4, isAvailable: true },
  { tableNo: "T-08", capacity: 6, isAvailable: true },
  { tableNo: "T-09", capacity: 2, isAvailable: false },
  { tableNo: "T-10", capacity: 8, isAvailable: true },
];

async function seed() {
  console.log("Seeding 10 restaurant tables...");
  for (const table of sampleTables) {
    const res = await prisma.restaurantTable.upsert({
      where: { tableNo: table.tableNo },
      update: {
        capacity: table.capacity,
        isAvailable: table.isAvailable,
      },
      create: {
        tableNo: table.tableNo,
        capacity: table.capacity,
        isAvailable: table.isAvailable,
      },
    });
    console.log(`Table ${res.tableNo} (Capacity: ${res.capacity}, Available: ${res.isAvailable}) ready.`);
  }
  console.log("Seeding complete! 10 tables are in the database.");
}

seed()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
