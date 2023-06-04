import { Module } from '@nestjs/common';
import { CommonsService } from './commons.service';
import { RedisModule } from './redis/redis.module';
import { PlaywrightModule } from './playwright/playwright.module';

@Module({
  providers: [CommonsService],
  exports: [CommonsService],
  imports: [RedisModule, PlaywrightModule],
})
export class CommonsModule {}
