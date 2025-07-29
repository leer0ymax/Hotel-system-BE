import { db } from "../src/Drizzle/db";

async function resetDatabase() {
  try {
    // Adjust table names if needed
    await db.execute(`
      TRUNCATE TABLE "Booking", "Room", "Hotel", "User" RESTART IDENTITY CASCADE
    `);
    console.log("✅ Old data wiped out. IDs reset.");
  } catch (err) {
    console.error("❌ Error while resetting database:", err);
  }
}

resetDatabase();
