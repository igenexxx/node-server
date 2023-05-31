import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { LoggerServiceModel } from '../logger/logger.interface.js';
import { TYPES } from '../types/types.js';

@injectable()
export class PrismaService {
  client: PrismaClient;

  constructor(@inject(TYPES.LoggerServiceModel) private logger: LoggerServiceModel) {
    this.client = new PrismaClient();
  }

  async connect(): Promise<void> {
    await this.client
      .$connect()
      .then(() => {
        this.logger.log('[Prisma service] Connected to database');
      })
      .catch((e) => {
        if (e instanceof Error) {
          this.logger.error('[Prisma service] Failed to connect to database', e);
        }
      });
  }

  async disconnect(): Promise<void> {
    await this.client
      .$disconnect()
      .then(() => {
        this.logger.log('[Prisma service] Disconnected from database');
      })
      .catch((e) => {
        if (e instanceof Error) {
          this.logger.error('[Prisma service] Failed to disconnect from database', e);
        }
      });
  }
}
