import { Module } from '@nestjs/common';
import { CommonsService } from './commons.service';
import { JsonXpathParserModule } from './json-xpath-parser/json-xpath-parser.module';
import { PlaywrightModule } from './playwright/playwright.module';
import { RedisModule } from './redis/redis.module';

@Module({
  providers: [CommonsService],
  exports: [CommonsService],
  imports: [RedisModule, PlaywrightModule, JsonXpathParserModule],
})
export class CommonsModule {}
