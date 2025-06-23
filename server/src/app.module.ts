import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from './database/knex/knex.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { UsersModule } from './modules/users/users.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { MongoModule } from './database/mongo/mongo.module';
import { FileUploadModule } from './modules/files/file-upload.module';
import { LogModule } from './modules/logs/log.module';
import { SchedulerModule } from './modules/scheduler/schedule.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        store: redisStore,
        url: process.env.REDIS_URL,
        ttl: 500,
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    MongoModule,
    KnexModule,
    AuthenticationModule,
    UsersModule,
    TasksModule,
    FileUploadModule,
    LogModule,
    SchedulerModule,
  ],
})
export class AppModule {}
