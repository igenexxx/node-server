import { injectable } from 'inversify';
import type { ILogObj } from 'tslog';
import { Logger } from 'tslog';

import 'reflect-metadata';
import type { LoggerServiceModel } from './logger.interface.js';

@injectable()
export class LoggerService implements LoggerServiceModel {
  logger: Logger<ILogObj>;

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
