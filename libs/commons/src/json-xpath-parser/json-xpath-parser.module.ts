import { Module } from '@nestjs/common';
import { JsonXpathParserService } from './json-xpath-parser.service';

@Module({
  providers: [JsonXpathParserService],
  exports: [JsonXpathParserService],
})
export class JsonXpathParserModule {}
