import type { interfaces } from 'inversify';
import { Container, ContainerModule } from 'inversify';

import { App } from './app.js';
import { ConfigService } from './config/config.service.js';
import type { ConfigServiceModel } from './config/configService.interface.js';
import { PrismaService } from './database/prisma.service.js';
import { ExceptionError } from './errors/exception.error.js';
import type { ExceptionErrorModel } from './errors/exceptionError.interface.js';
import type { LoggerServiceModel } from './logger/logger.interface.js';
import { LoggerService } from './logger/logger.service.js';
import { TYPES } from './types/types.js';
import { UserController } from './users/user.controller.js';
import type { UserControllerModel } from './users/user.interface.js';
import { UsersRepository } from './users/users.repository.js';
import { UsersService } from './users/users.service.js';
import type { UsersRepositoryModel } from './users/usersRepository.interface.js';
import type { UsersServiceModel } from './users/usersService.interface.js';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<LoggerServiceModel>(TYPES.LoggerServiceModel).to(LoggerService).inSingletonScope();
  bind<ExceptionErrorModel>(TYPES.ExceptionErrorModel).to(ExceptionError).inSingletonScope();
  bind<UserControllerModel>(TYPES.UserController).to(UserController).inSingletonScope();
  bind<UsersServiceModel>(TYPES.UsersService).to(UsersService).inSingletonScope();
  bind<ConfigServiceModel>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
  bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
  bind<UsersRepositoryModel>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
  bind<App>(TYPES.Application).to(App);
});

const init = async (): Promise<{ app: App; appContainer: Container }> => {
  const appContainer = new Container();
  appContainer.load(appBindings);
  const app = appContainer.get<App>(TYPES.Application);

  await app.init();

  return { app, appContainer };
};

export const boot = init();
