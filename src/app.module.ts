import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PlaywrightModule } from '@libs/commons/playwright/playwright.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PlaywrightModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
