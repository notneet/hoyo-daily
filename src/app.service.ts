import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  makeXpath(...xpath: string[]): string {
    return `xpath=${xpath.join('/')}`;
  }
}
