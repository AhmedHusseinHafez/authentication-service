import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfigService } from '../config/env.config';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [EnvConfigService],
            extraProviders: [EnvConfigService],
            useFactory: (config: EnvConfigService) => ({
                type: 'postgres',
                host: config.get('DB_HOST'),
                port: config.get('DB_PORT'),
                username: config.get('DB_USERNAME'),
                password: config.get('DB_PASSWORD'),
                database: config.get('DB_NAME'),
                // Automatically load all entities registered via TypeOrmModule.forFeature()
                autoLoadEntities: true,
                migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
                // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: false,
                // logging: config.get('NODE_ENV') !== 'prod',
            }),
        }),
    ],
    exports: [TypeOrmModule],
})
export class DbModule { }



