import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { HealthModule } from './modules/health/health.module';
import { EnvConfigService, validateEnv } from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.dev', '.env.prod', '.env.staging'],
      validate: validateEnv,
    }),
    DbModule,
    AuthModule,
    UsersModule,
    TasksModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService, EnvConfigService],
})
export class AppModule { }
