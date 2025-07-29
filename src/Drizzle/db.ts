import "dotenv/config";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const client = neon(process.env.DATABASE_URL as string);

let db = drizzle(client, { schema, logger: true });

export const connectToDB = async () => {
    // No connect method needed for Neon serverless client
    console.log("Connected to the database (Neon serverless, no explicit connect)");
};

export const disconnectDB = async () => {
    // No end method needed for Neon serverless client
    console.log("Disconnected from the database (Neon serverless, no explicit disconnect)");
};

export { db, client };