export enum EnvKey {
  REDIS_HOST = 'REDIS_HOST',
  REDIS_PORT = 'REDIS_PORT',
  REDIS_DB = 'REDIS_DB',
  HEADLESS = 'HEADLESS',
  PROXY_SERVER = 'PROXY_SERVER',
  PROXY_USER = 'PROXY_USER',
  PROXY_PASS = 'PROXY_PASS',
  COOKIES_PATH = 'COOKIES_PATH',
}

export enum HoyoXpath {
  BASE_URL = 'https://www.hoyolab.com',
  HOME_OVERLAY = `//div[@id='driver-page-overlay']`,
  HOME_DIALOG = `//div[@class='mhy-dialog__body']`,
  /**
   * 1. open homepage
   * 2. select game
   * 3. select check-in button
   */
  M_SELECT_GAME_CONTAINER = `//div[@class='game-select-game']`,
  M_SELECT_GENSHIN = `./div[1]`,
  M_GAME_TOOL_BOX_CONTAINER = `//div[@class='mhy-swiper-slide swiper-slide swiper-slide-active']/./div`,
  M_CHECKIN_BUTTON = `./div[@class='game-tools-cell'][2]`,
  M_CHECKIN_LOAD_MORE = `//div[@class='components-m-assets-__index_---more-wrapper---L23p0a']`,
  M_SIGN_IN_CONTAINER = `//div[@class='components-m-assets-__index_---sign-list---1seWJQ']`,
  M_SIGN_IN_LIST_NOW = `./div`,
  M_SIGN_IN_NOW = `.//div[@class='components-m-assets-__index_---actived-day---Es_5Yq']`,

  // ============================= //
  HOME_DIALOG_BUTTON = `//button[text() = 'Skip']`,
  CLOSE_DOWNLOAD_BUTTON = `//span[@class='components-home-assets-__sign-guide_---guide-close---2VvmzE']`,
  TOOLS_CONTAINER = `//div[@class='mhy-side-section mhy-tools-container']`,
  TITLE_CONTAINER = `.//div[@class='text']`,
  TOOLS_LIST_CONTAINER = `.//div[contains(@class,'tools-list')][1]`,
  DAILY_CHECKIN_BUTTON = `./div[2]`,
  SIGN_IN_CONTAINER = `//div[@class='components-home-assets-__sign-content_---sign-list---1E-cUZ']`,
  SIGN_IN_COTENT_LIST = `./div[contains(@class,'components-home-assets-__sign-content_---sign-item---k8WFIr')]`,
  SIGN_IN_NOW = `.//div[@class='components-home-assets-__sign-content_---actived-day---2GukeS']`,
  DAILY_DIALOG_BUTTON = `//div[@class='components-common-common-dialog-__index_---dialog-close---1Yc84V']`,
  DAILY_NEXT_ITEM_INFO = `//div[@class='components-common-common-dialog-__index_---next-info---3oTiNW']`,
}
