import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getEnv } from "../shared/config/env.js";
import * as schema from "./schema.js";

const pool = new Pool({
  connectionString: getEnv().DATABASE_URL
});

export const db = drizzle(pool, { schema });

export const closeDb = async () => {
  await pool.end();
};
