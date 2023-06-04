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
  HOME_DIALOG_BUTTON = `//button[text() = 'Skip']`,
  CLOSE_DOWNLOAD_BUTTON = `//span[@class='components-home-assets-__sign-guide_---guide-close---2VvmzE']`,
  TOOLS_CONTAINER = `//div[@class='mhy-side-section mhy-tools-container']`,
  TITLE_CONTAINER = `.//div[@class='text']`,
  TOOLS_LIST_CONTAINER = `.//div[contains(@class,'tools-list')][1]`,
  DAILY_CHECKIN_BUTTON = `./div[2]`,
  SIGN_IN_CONTAINER = `//div[@class='components-home-assets-__sign-content_---sign-list---1E-cUZ']`,
  SIGN_IN_COTENT_LIST = `./div[contains(@class,'components-home-assets-__sign-content_---sign-item---k8WFIr')]`,
  SIGN_IN_NOW = `./div[@class='components-home-assets-__sign-content_---sign-item---k8WFIr components-home-assets-__sign-content_---sign-wrapper---38rWqB']`,
  DAILY_DIALOG_BUTTON = `//div[@class='components-common-common-dialog-__index_---dialog-close---1Yc84V']`,
  DAILY_NEXT_ITEM_INFO = `//div[@class='components-common-common-dialog-__index_---next-info---3oTiNW']`,
}
