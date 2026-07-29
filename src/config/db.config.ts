import { registerAs } from '@nestjs/config';
import { dbConfigSchema } from '../schema/database.schema';

export default registerAs('db', () => {
    const config = dbConfigSchema.parse(process.env);
    return {
        NODE_ENV: config.NODE_ENV,
        host: config.DB_HOST,
        port: config.DB_PORT,
        username: config.DB_USERNAME,
        password: config.DB_PASSWORD,
        database: config.DB_NAME,
        type: config.DB_TYPE,
        synchronize: config.NODE_ENV === 'development',
    };
});