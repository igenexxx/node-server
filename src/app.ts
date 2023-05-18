import type { Express } from 'express';
import express from 'express';
import { inject, injectable } from 'inversify';
import type { Server } from 'node:http';

import 'reflect-metadata';
import { ExceptionErrorModel } from './errors/exceptionError.interface.js';
import { LoggerServiceModel } from './logger/logger.interface.js';
import { TYPES } from './types/types.js';
import { UserController } from './users/user.controller.js';

@injectable()
export class App {
  app: Express;
  server: Server;
  port: number;

  constructor(
    @inject(TYPES.LoggerServiceModel) private logger: LoggerServiceModel,
    @inject(TYPES.UserController) private userController: UserController,
    @inject(TYPES.ExceptionErrorModel) public exceptionHandler: ExceptionErrorModel,
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

  init() {
    this.useRoutes();
    this.useExceptionHandler();
    this.server = this.app.listen(this.port);
    this.logger.log(`Server listening on port ${this.port}`);
  }
}
