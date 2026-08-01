import { DataSource } from 'typeorm';
import { config as loadEnv } from 'dotenv';
import { validateEnv } from '../config/env.config';

loadEnv({ path: `.env.${process.env.NODE_ENV ?? 'dev'}` });
const env = validateEnv(process.env);

console.log({
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});

export default new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: false,
  migrationsTableName: "migrations",
  migrationsTransactionMode: "all",
});
