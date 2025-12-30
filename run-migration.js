import "dotenv/config";
import { readFileSync } from "fs";
import pkg from "pg";

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // для Railway
});

async function runMigration() {
  try {
    await client.connect();
    console.log("✅ Connected to database");

    const sql = readFileSync("./migrations/001_create_leads.sql", "utf8");

    await client.query(sql);
    console.log("✅ Migration applied");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
  } finally {
    await client.end();
  }
}

runMigration();
