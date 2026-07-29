import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import dbConfig from '../config/db.config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [dbConfig.KEY],
            useFactory: (config: ConfigType<typeof dbConfig>) => ({
                type: config.DB_TYPE as any,
                host: config.DB_HOST,
                port: config.DB_PORT,
                username: config.DB_USERNAME,
                password: config.DB_PASSWORD,
                database: config.DB_NAME,
                synchronize: config.SYNCHRONIZE,
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            }),
        }),
    ],
    exports: [TypeOrmModule],
})
export class DbModule { }



