import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigType } from '@nestjs/config';
import dbConfig from '../config/db.config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule.forFeature(dbConfig)],
            inject: [dbConfig.KEY],
            useFactory: (config: ConfigType<typeof dbConfig>) => ({
                type: config.type as any,
                host: config.host,
                port: config.port,
                username: config.username,
                password: config.password,
                database: config.database,
                logging: config.NODE_ENV === 'development',
                synchronize: config.synchronize,
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            }),
        }),
    ],
    exports: [TypeOrmModule],
})
export class DbModule { }



