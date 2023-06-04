// SPDX-License-Identifier: GPL-2.0
/*
 * Copyright (C) 2023 Hanivan Rizky Sobari <hanivan20@gmail.com>
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
