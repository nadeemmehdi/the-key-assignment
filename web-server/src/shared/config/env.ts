import { z } from "zod";
import { buildDatabaseUrl } from "./database-url.js";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  POSTGRES_HOST: z.string().min(1).default("localhost"),
  POSTGRES_PORT: z.coerce.number().int().positive().default(5432),
  POSTGRES_DB: z.string().min(1).default("saved_posts"),
  POSTGRES_USER: z.string().min(1).default("postgres"),
  POSTGRES_PASSWORD: z.string().min(1).default("postgres"),
  PORT: z.coerce.number().int().positive().default(3001),
  CORS_ALLOWED_ORIGINS: z.string().default("")
});

export type AppEnv = z.infer<typeof envSchema> & {
  DATABASE_URL: string;
};

let cachedEnv: AppEnv | null = null;

export const getEnv = (): AppEnv => {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    PORT: process.env.PORT ?? 3001,
    CORS_ALLOWED_ORIGINS: process.env.CORS_ALLOWED_ORIGINS ?? ""
  });

  cachedEnv = {
    ...parsed,
    DATABASE_URL:
      parsed.DATABASE_URL ??
      buildDatabaseUrl({
        host: parsed.POSTGRES_HOST,
        port: parsed.POSTGRES_PORT,
        database: parsed.POSTGRES_DB,
        user: parsed.POSTGRES_USER,
        password: parsed.POSTGRES_PASSWORD
      })
  };

  return cachedEnv;
};
