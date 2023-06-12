import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PlaywrightModule } from '@libs/commons/playwright/playwright.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JsonXpathParserModule } from '@libs/commons/json-xpath-parser/json-xpath-parser.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    JsonXpathParserModule,
    PlaywrightModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
