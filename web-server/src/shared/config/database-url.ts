type DatabaseConfig = {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
};

const encodeCredential = (value: string) => encodeURIComponent(value);

export const buildDatabaseUrl = (config: DatabaseConfig) =>
  `postgres://${encodeCredential(config.user)}:${encodeCredential(config.password)}@${config.host}:${config.port}/${config.database}`;
