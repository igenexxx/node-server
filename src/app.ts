import type { Express } from 'express';
import express from 'express';
import { inject, injectable } from 'inversify';
import type { Server } from 'node:http';

import 'reflect-metadata';
import { AuthMiddleware } from './common/auth.middleware.js';
import { ConfigServiceModel } from './config/configService.interface.js';
import { PrismaService } from './database/prisma.service.js';
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
    @inject(TYPES.ExceptionErrorModel) private exceptionHandler: ExceptionErrorModel,
    @inject(TYPES.ConfigService) private configService: ConfigServiceModel,
    @inject(TYPES.PrismaService) private prismaService: PrismaService,
  ) {
    this.app = express();
    this.port = 3000;
  }

  useRoutes(): void {
    this.app.use('/users', this.userController.router);
  }

  useExceptionHandler(): void {
    this.app.use(this.exceptionHandler.catch.bind(this.exceptionHandler));
  }

  useAuthMiddleware(): void {
    const authMiddleware = new AuthMiddleware(this.configService.get('JWT_SECRET'));
    this.app.use(authMiddleware.execute.bind(authMiddleware));
  }

  useMiddlewares(): void {
    this.app.use(express.json());
  }

  async connectDB(): Promise<void> {
    await this.prismaService.connect();
  }

  async init(): Promise<void> {
    this.useMiddlewares();
    this.useAuthMiddleware();
    this.useRoutes();
    this.useExceptionHandler();
    await this.connectDB();
    this.server = this.app.listen(this.port);
    this.logger.log(`Server listening on port ${this.port}`);
  }

  close(): void {
    this.server.close();
  }
}
