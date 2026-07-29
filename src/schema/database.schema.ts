import * as z from "zod";

export const dbConfigSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'staging', 'test']).default('development'),
    DB_HOST: z.string().min(1, 'DB_HOST is required'),
    DB_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
    DB_USERNAME: z.string().min(1, 'DB_USERNAME is required'),
    DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),
    DB_NAME: z.string().min(1, 'DB_NAME is required'),
    DB_TYPE: z.string().min(1, 'DB_TYPE is required'),
    SYNCHRONIZE: z.boolean().default(false),
});

export type DbEnv = z.infer<typeof dbConfigSchema>;