import { RedisModule } from '@libs/commons/redis/redis.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PlaywrightService } from './playwright.service';

@Module({
  imports: [RedisModule, ConfigModule.forRoot(), ScheduleModule.forRoot()],
  providers: [PlaywrightService],
  exports: [PlaywrightService],
})
export class PlaywrightModule {}
