import type { ILogObj, Logger } from 'tslog';

export interface LoggerServiceModel {
  logger: Logger<ILogObj>;

  log(...args: unknown[]): void;

  error(...args: unknown[]): void;

  warn(...args: unknown[]): void;
}
