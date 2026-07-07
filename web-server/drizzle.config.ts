import { defineConfig } from "drizzle-kit";
import { buildDatabaseUrl } from "./src/shared/config/database-url";
import { loadEnvFile } from "./src/shared/config/env-file";

loadEnvFile();

const connectionString =
  process.env.DATABASE_URL ??
  buildDatabaseUrl({
    host: process.env.POSTGRES_HOST ?? "localhost",
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    database: process.env.POSTGRES_DB ?? "saved_posts",
    user: process.env.POSTGRES_USER ?? "postgres",
    password: process.env.POSTGRES_PASSWORD ?? "postgres"
  });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString
  }
});
