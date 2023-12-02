// SPDX-License-Identifier: GPL-2.0
/*
 * Copyright (C) 2023 Hanivan Rizky Sobari <hanivan20@gmail.com>
 */

import { EnvKey } from '@libs/commons/constant';
import { LogLevel } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const configModule = await NestFactory.createApplicationContext(
    ConfigModule.forRoot(),
  );
  const configService = configModule.get(ConfigService);
  const appEnv = configService.get<string>(EnvKey.NODE_ENV, 'production');
  configModule.close();
  const logger: LogLevel[] =
    appEnv === 'development'
      ? ['log', 'debug', 'error']
      : ['log', 'verbose', 'error'];
  console.log(`App env: ${appEnv}, logger: ${logger}`);

  const app = await NestFactory.createMicroservice(AppModule, { logger });
  await app.listen();
}
bootstrap();
