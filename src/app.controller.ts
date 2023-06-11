import { Controller, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { AppService } from './app.service';
import { PlaywrightService } from '@libs/commons/playwright/playwright.service';
import { ElementHandle, Page } from 'playwright';
import { HoyoXpath } from '@libs/commons/constant';
import { Cron, CronExpression } from '@nestjs/schedule';

export type TagElement = ElementHandle<SVGElement | HTMLElement>;

@Controller()
export class AppController implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppController.name);
  private readonly hoyoIndexPage = `${HoyoXpath.BASE_URL}/home`;
  private readonly waitAfterConnectedInSec = 3;

  constructor(
    private readonly appService: AppService,
    private readonly playwrightService: PlaywrightService,
  ) {}

  private get timeout() {
    return 30 * 1000;
  }

  private async waitForSec(sec: number = this.waitAfterConnectedInSec) {
    return await new Promise((res) => setTimeout(res, sec * 1000));
  }

  async onApplicationBootstrap() {
    await this.init();
  }

  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  async init() {
    let checkInItems: TagElement[];
    let checkInItem: TagElement;
    const page: Page = await this.playwrightService.createPage();
    const xpathChooseGame = this.appService.makeXpath(
      HoyoXpath.M_SELECT_GAME_CONTAINER,
      HoyoXpath.M_SELECT_GENSHIN,
    );
    const xpathDailyPage = this.appService.makeXpath(
      HoyoXpath.M_GAME_TOOL_BOX_CONTAINER,
      HoyoXpath.M_CHECKIN_BUTTON,
    );
    const xpathLoadMore = this.appService.makeXpath(
      HoyoXpath.M_CHECKIN_LOAD_MORE,
    );
    const xpathCheckInList = this.appService.makeXpath(
      HoyoXpath.M_SIGN_IN_CONTAINER,
      HoyoXpath.M_SIGN_IN_LIST_NOW,
    );
    const xpathCheckItem = this.appService.makeXpath(
      HoyoXpath.M_SIGN_IN_CONTAINER,
      HoyoXpath.M_SIGN_IN_NOW,
    );
    const xpathNextItem = this.appService.makeXpath(
      HoyoXpath.DAILY_NEXT_ITEM_INFO,
    );
    const xpathCloseDialogDaily = this.appService.makeXpath(
      HoyoXpath.DAILY_DIALOG_BUTTON,
    );
    this.logger.verbose(`Opening web ${this.hoyoIndexPage}`);

    try {
      await page.goto(this.hoyoIndexPage, {
        waitUntil: 'domcontentloaded',
        timeout: this.timeout,
      });
      await this.waitForSec(3);
      await page.click(xpathChooseGame);
      await this.waitForSec(6);
      await page.click(xpathDailyPage);
      await this.waitForSec(8);
      const dailyCheckInPage = this.playwrightService.browserContext.pages()[1];
      this.logger.verbose(`Process page ${await dailyCheckInPage.title()}`);
      await dailyCheckInPage.click(xpathLoadMore);
      await this.waitForSec(12);

      checkInItems = await dailyCheckInPage.$$(xpathCheckInList);
      checkInItem = await dailyCheckInPage.$(xpathCheckItem);
      const currentCheckInIndex = await this.getCurrentCheckInComponent(
        checkInItems,
        await checkInItem?.getAttribute('class'),
      );

      if (currentCheckInIndex !== null) {
        const xpathCheckIn = this.appService.makeXpath(
          HoyoXpath.M_SIGN_IN_CONTAINER,
          `./div[${currentCheckInIndex + 1}]`,
        );
        this.logger.verbose(`new check in found...`);
        console.log(xpathCheckIn);
        await dailyCheckInPage.click(xpathCheckIn);
        await this.waitForSec(12);
        this.logger.verbose(`Checked In`);

        const nextItem = await dailyCheckInPage.$(xpathNextItem);
        if (nextItem) {
          this.logger.verbose(
            `Next Item: ${await dailyCheckInPage.textContent(xpathNextItem)}`,
          );
        }
      }

      await this.killPages([page, dailyCheckInPage]);
      this.logger.verbose(`Done Check-In. Kill pages`);
      return;
    } catch (error) {
      if (page && !page.isClosed()) {
        page?.close();
      }
      console.error(error);
    }
  }

  async getCurrentCheckInComponent(
    listCheckIn: TagElement[],
    searchAbleClassName: string,
  ) {
    if (listCheckIn?.length < 1 || !searchAbleClassName) return null;

    for (let i = 0; i < listCheckIn.length; i++) {
      const currentClass = await listCheckIn[i].getAttribute('class');
      if (currentClass === HoyoXpath.M_SIGN_IN_NOW_CLASS_NAME) {
        return i;
      }
    }

    return null;
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
