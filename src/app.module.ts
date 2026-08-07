import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { HealthModule } from './modules/health/health.module';
import { Env, EnvConfigService, validateEnv } from './config/env.config';

/** Fallback when THROTTLE_TTL / THROTTLE_LIMIT are omitted (ttl in ms). */
const DEFAULT_THROTTLE_TTL_MS = 60_000;
const DEFAULT_THROTTLE_LIMIT = 100;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.dev', '.env.prod', '.env.staging'],
      validate: validateEnv,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => {
        const ttl = config.get('THROTTLE_TTL', { infer: true });
        const limit = config.get('THROTTLE_LIMIT', { infer: true });

        return [
          {
            name: 'default',
            ttl: ttl ?? DEFAULT_THROTTLE_TTL_MS,
            limit: limit ?? DEFAULT_THROTTLE_LIMIT,
          },
        ];
      },
    }),
    DbModule,
    AuthModule,
    UsersModule,
    TasksModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EnvConfigService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
