import { readFileSync } from "fs";
import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function runMigration() {
  try {
    await client.connect();
    console.log("✅ Connected to DB");

    const sql = readFileSync("./migrations/001_create_leads_table.sql", "utf8");

    await client.query(sql);
    console.log("✅ Table created");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await client.end();
  }
}

runMigration();


