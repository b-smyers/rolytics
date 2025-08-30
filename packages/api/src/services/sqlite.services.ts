import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import logger from "@services/logger.services";

const dbFile: string =
  process.env.NODE_ENV !== "test" ? "database.db" : ":memory:";

// SQL schema files
const modelFiles: string[] = [
  path.join(__dirname, "../models", "users.models.sql"),
  path.join(__dirname, "../models", "experiences.models.sql"),
  path.join(__dirname, "../models", "places.models.sql"),
  path.join(__dirname, "../models", "servers.models.sql"),
  path.join(__dirname, "../models", "metrics.models.sql"),
  path.join(__dirname, "../models", "user_settings.models.sql"),
];

const db = new Database(dbFile);
db.pragma("journal_mode = WAL");
logger.info("Database connected");

// Execute schemas
for (const filePath of modelFiles) {
  const schema = fs.readFileSync(filePath, "utf-8");

  try {
    db.exec(schema);
  } catch (error: any) {
    console.error(`Model error: ${filePath}\nSQLite3 error:${error.message}`);
    process.exit(1);
  }
}
logger.info("All schemas executed successfully");

// Export the database instance
export default db;
