import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { promisify } from 'util';
import { HoyoXpathKey } from '../constant';

const readFile = promisify(fs.readFile);

@Injectable()
export class JsonXpathParserService {
  private readonly logger = new Logger(JsonXpathParserService.name);
  private readonly xpathMap: Map<HoyoXpathKey, string> = new Map<
    HoyoXpathKey,
    string
  >();

  async loadGenshinXpath() {
    this.logger.log(`Load Genshin Xpath...`);

    const jsonString = await readFile(`./assets/genshin-xpath.json`, 'utf8');
    const genshinXpath = JSON.parse(jsonString);

    for (const key of Object.keys(genshinXpath)) {
      this.xpathMap.set(key as HoyoXpathKey, genshinXpath[key]);
    }
  }

  getHoyoXpath(key: HoyoXpathKey) {
    return this.xpathMap.get(key);
  }
}
