// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { ILogObj } from 'tslog';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Logger } from 'tslog';

export class LoggerService {
  private logger: Logger<ILogObj>;

  constructor() {
    this.logger = new Logger({
      type: 'pretty',
    });
  }

  log(...args: unknown[]): void {
    this.logger.info(...args);
  }

  error(...args: unknown[]): void {
    this.logger.error(...args);
  }

  warn(...args: unknown[]): void {
    this.logger.warn(...args);
  }
}
