import { Module, Global } from '@nestjs/common';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';
import { env } from 'process';
@Global()
@Module({
  imports: [
    NestRedisModule.forRootAsync({
      useFactory: () => ({
        type: 'single',
        url: env.REDIS_URL,
      }),
    }),
  ],
  exports: [NestRedisModule],
})
export class RedisModule {}
