import type { Express } from 'express';
import express from 'express';
import type { Server } from 'node:http';

import type { LoggerService } from './logger/logger.service';
import { userRouter } from './users/users';

export class App {
  app: Express;
  server: Server;
  port: number;

  constructor(private logger: LoggerService) {
    this.app = express();
    this.port = 8000;
  }

  useRoutes() {
    this.app.use('/users', userRouter);
  }

  async init() {
    this.useRoutes();
    this.server = this.app.listen(this.port);
    this.logger.log(`Server listening on port ${this.port}`);
  }
}
