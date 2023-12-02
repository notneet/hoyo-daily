import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';
import { EnvKey } from '../constant';

const redisProvider = {
  provide: 'redis',
  useFactory(config: ConfigService) {
    return new IORedis({
      host: config.get(EnvKey.REDIS_HOST, 'localhost'),
      port: Number(config.get(EnvKey.REDIS_PORT, 6379)),
      db: Number(config.get(EnvKey.REDIS_DB, 0)),
    });
  },
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}
