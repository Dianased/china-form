// run-migration.js
import { readFileSync } from "fs";
import { Client } from "pg";

const client = new Client({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: { rejectUnauthorized: false }, // ✅ для Railway
});

async function runMigration() {
  try {
    await client.connect();
    console.log("✅ Подключились к базе данных");

    const sql = readFileSync("./migrations/001_create_leads_table.sql", "utf8");

    await client.query(sql);
    console.log('✅ Таблица "leads" создана или уже существует');
  } catch (err) {
    console.error("❌ Ошибка миграции:", err);
  } finally {
    await client.end();
  }
}

runMigration();
