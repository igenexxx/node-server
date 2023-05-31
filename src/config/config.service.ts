import type { DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { config } from 'dotenv';
import { inject, injectable } from 'inversify';

import { LoggerServiceModel } from '../logger/logger.interface.js';
import { TYPES } from '../types/types.js';
import type { ConfigServiceModel } from './configService.interface.js';

@injectable()
export class ConfigService implements ConfigServiceModel {
  readonly #config: DotenvParseOutput;

  constructor(@inject(TYPES.LoggerServiceModel) private readonly logger: LoggerServiceModel) {
    const { parsed, error }: DotenvConfigOutput = config();

    if (error) {
      this.logger.error('[ConfigService]', 'Error loading .env file');
    } else {
      this.logger.log('[ConfigService]', 'Loaded .env file');
      this.#config = parsed as DotenvParseOutput;
    }
  }

  get(key: string): string {
    return this.#config[key];
  }
}
