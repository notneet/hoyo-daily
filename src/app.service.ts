import { EnvKey } from '@libs/commons/constant';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Page } from 'playwright';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private waitAfterConnectedInSec: number;

  constructor(private readonly config: ConfigService) {
    this.waitAfterConnectedInSec = config.get<number>(
      EnvKey.WAIT_TIME_IN_SEC,
      15,
    );
  }

  makeXpath(...xpath: string[]): string {
    return `xpath=${xpath.join('/')}`;
  }

  async waitForSec(state: string, sec: number = this.waitAfterConnectedInSec) {
    this.logger.log(`[${state}] Waiting For ${sec}sec before process`);

    return await new Promise((res) => setTimeout(res, sec * 1000));
  }

  async killPages(pages: Page[]) {
    do {
      try {
        pages.map(async (page) => {
          if (page && !page.isClosed()) {
            page.close().catch(() => {
              this.logger.error(`can't close page properly ${page.url()}`);
            });
          }
        });
      } catch (error) {
        console.error(error);
      }
    } while (pages.length < 1);
  }
}
