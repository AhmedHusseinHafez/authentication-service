import { registerAs } from '@nestjs/config';
import { dbConfigSchema } from '../schema/database.schema';

export default registerAs('db', () => {
    const result = dbConfigSchema.safeParse(process.env);
    console.log(result);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
});