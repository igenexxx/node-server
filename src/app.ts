import type { Express } from 'express';
import express from 'express';
import type { Server } from 'node:http';

import type { ExceptionError } from './errors/exception.error';
import type { LoggerService } from './logger/logger.service';
import type { UserController } from './users/user.controller';

export class App {
  app: Express;
  server: Server;
  port: number;

  constructor(
    private logger: LoggerService,
    private userController: UserController,
    public exceptionHandler: ExceptionError,
  ) {
    this.app = express();
    this.port = 8000;
  }

  useRoutes() {
    this.app.use('/users', this.userController.router);
  }

  useExceptionHandler() {
    this.app.use(this.exceptionHandler.catch.bind(this.exceptionHandler));
  }

  async init() {
    this.useRoutes();
    this.useExceptionHandler();
    this.server = this.app.listen(this.port);
    this.logger.log(`Server listening on port ${this.port}`);
  }
}
