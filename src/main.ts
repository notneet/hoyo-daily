// SPDX-License-Identifier: GPL-2.0
/*
 * Copyright (C) 2023 Hanivan Rizky Sobari <hanivan20@gmail.com>
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvKey } from '@libs/commons/constant';
import { LogLevel } from '@nestjs/common';

async function bootstrap() {
  const configModule = await NestFactory.createApplicationContext(
    ConfigModule.forRoot({ envFilePath: ['.env', '.env.prod', '.env.dev'] }),
  );
  const configService = configModule.get(ConfigService);
  const isDev =
    configService.get<string>(EnvKey.NODE_ENV, 'production') === 'development';
  const logger: LogLevel[] = isDev
    ? ['log', 'debug', 'error']
    : ['log', 'verbose', 'error'];
  console.log(`App Env: ${isDev}`);

  const app = await NestFactory.createMicroservice(AppModule, { logger });
  await app.listen();
}
bootstrap();
