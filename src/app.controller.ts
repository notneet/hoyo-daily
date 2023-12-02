import { HoyoXpathKey } from '@libs/commons/constant';
import { JsonXpathParserService } from '@libs/commons/json-xpath-parser/json-xpath-parser.service';
import { PlaywrightService } from '@libs/commons/playwright/playwright.service';
import { Controller, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ElementHandle, Page } from 'playwright';
import { AppService } from './app.service';

export type TagElement = ElementHandle<SVGElement | HTMLElement>;

@Controller()
export class AppController implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly playwrightService: PlaywrightService,
    private readonly xpathParserService: JsonXpathParserService,
  ) {}

  private get timeout() {
    return 30 * 1000;
  }

  async onApplicationBootstrap() {
    await this.init();
  }

  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  async init() {
    await this.xpathParserService.loadGenshinXpath();

    const xpathNextItem = this.appService.makeXpath(
      this.xpathParserService.getHoyoXpath(HoyoXpathKey.DAILY_NEXT_ITEM_INFO),
    );
    const page: Page = await this.playwrightService.createPage();

    try {
      const genshinHomePage = await this.openGenshinHomePage(page);
      const dailyCheckInPage = await this.navigateToDailyCheckInPage(
        genshinHomePage,
      );
      const currentCheckInIndex = await this.getCurrentCheckIn(
        dailyCheckInPage,
      );

      if (currentCheckInIndex !== null) {
        const xpathCheckIn = this.appService.makeXpath(
          this.xpathParserService.getHoyoXpath(
            HoyoXpathKey.M_SIGN_IN_CONTAINER,
          ),
          `./div[${currentCheckInIndex + 1}]`,
        );

        this.logger.verbose(`new check in found...`);
        await dailyCheckInPage.click(xpathCheckIn);
        this.logger.verbose(`Checked In`);

        await this.appService.waitForSec(`Next Item`);

        const nextItem = await dailyCheckInPage.$(xpathNextItem);
        if (nextItem) {
          this.logger.verbose(
            `Next Item: ${await dailyCheckInPage.textContent(xpathNextItem)}`,
          );
        }
      }

      await this.appService.killPages([page, dailyCheckInPage]);
      this.logger.verbose(`Done Check-In. Kill pages`);

      return;
    } catch (error) {
      if (page && !page.isClosed()) {
        await this.appService.killPages([page]);
      }
      console.error(error);
    }
  }

  private async openGenshinHomePage(page: Page) {
    const hoyoIndexPage = `${this.xpathParserService.getHoyoXpath(
      HoyoXpathKey.BASE_URL,
    )}`;
    try {
      this.logger.verbose(`Open ${hoyoIndexPage}`);
      await page.goto(hoyoIndexPage, {
        waitUntil: 'domcontentloaded',
        timeout: this.timeout,
      });
      await this.appService.waitForSec('Homepage');

      return page;
    } catch (error) {
      if (page && !page.isClosed()) {
        await this.appService.killPages([page]);
      }
      console.error(error);
    }
  }

  private async navigateToDailyCheckInPage(page: Page) {
    const xpathChooseGame = this.appService.makeXpath(
      this.xpathParserService.getHoyoXpath(
        HoyoXpathKey.M_SELECT_GAME_CONTAINER,
      ),
      this.xpathParserService.getHoyoXpath(HoyoXpathKey.M_SELECT_GENSHIN),
    );
    const navigateTabHoyoGuide = this.appService.makeXpath(
      this.xpathParserService.getHoyoXpath(HoyoXpathKey.M_SELECT_TAB_CONTAINER),
      this.xpathParserService.getHoyoXpath(HoyoXpathKey.M_SELECT_TAB_GUIDE),
    );
    const xpathDailyPage = this.appService.makeXpath(
      this.xpathParserService.getHoyoXpath(
        HoyoXpathKey.M_GAME_TOOL_BOX_CONTAINER,
      ),
      this.xpathParserService.getHoyoXpath(HoyoXpathKey.M_CHECKIN_BUTTON),
    );
    const xpathLoadMore = this.appService.makeXpath(
      this.xpathParserService.getHoyoXpath(HoyoXpathKey.M_CHECKIN_LOAD_MORE),
    );

    await page.click(xpathChooseGame);
    await this.appService.waitForSec('Choose Game');

    await page.click(navigateTabHoyoGuide);
    await this.appService.waitForSec('Navigate Tab Guide');

    await page.click(xpathDailyPage);
    await this.appService.waitForSec('Daily Check-In');

    const dailyCheckInPage = this.playwrightService.browserContext.pages()[1];
    this.logger.verbose(`Process page ${await dailyCheckInPage.title()}`);

    await dailyCheckInPage.click(xpathLoadMore);
    await this.appService.waitForSec('Load More');

    return dailyCheckInPage;
  }

  private async getCurrentCheckIn(dailyCheckInPage: Page) {
    const xpathCheckInList = this.appService.makeXpath(
      this.xpathParserService.getHoyoXpath(HoyoXpathKey.M_SIGN_IN_CONTAINER),
      this.xpathParserService.getHoyoXpath(HoyoXpathKey.M_SIGN_IN_LIST_NOW),
    );
    const xpathCheckItem = this.appService.makeXpath(
      this.xpathParserService.getHoyoXpath(HoyoXpathKey.M_SIGN_IN_CONTAINER),
      this.xpathParserService.getHoyoXpath(HoyoXpathKey.M_SIGN_IN_NOW),
    );

    const checkInItems = await dailyCheckInPage.$$(xpathCheckInList);
    const checkInItem = await dailyCheckInPage.$(xpathCheckItem);
    const currentCheckInIndex = await this.getCurrentCheckInComponent(
      checkInItems,
      await checkInItem?.getAttribute('class'),
    );

    return currentCheckInIndex;
  }

  private async getCurrentCheckInComponent(
    listCheckIn: TagElement[],
    searchAbleClassName: string,
  ) {
    if (listCheckIn?.length < 1 || !searchAbleClassName) return null;

    for (let i = 0; i < listCheckIn.length; i++) {
      const currentClass = await listCheckIn[i].getAttribute('class');
      if (
        currentClass ===
        this.xpathParserService.getHoyoXpath(
          HoyoXpathKey.M_SIGN_IN_NOW_CLASS_NAME,
        )
      ) {
        return i;
      }
    }

    return null;
  }
}
