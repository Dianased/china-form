import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, "migrations", "001_create_leads_table.sql"),
      "utf-8"
    );

    await pool.query(sql);
    console.log("✅ Migration applied successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

runMigration();
