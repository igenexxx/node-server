import type { interfaces } from 'inversify';
import { Container, ContainerModule } from 'inversify';

import { App } from './app.js';
import { ExceptionError } from './errors/exception.error.js';
import type { ExceptionErrorModel } from './errors/exceptionError.interface.js';
import type { LoggerServiceModel } from './logger/logger.interface.js';
import { LoggerService } from './logger/logger.service.js';
import { TYPES } from './types/types.js';
import { UserController } from './users/user.controller.js';
import type { UserControllerModel } from './users/user.interface.js';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<LoggerServiceModel>(TYPES.LoggerServiceModel).to(LoggerService);
  bind<ExceptionErrorModel>(TYPES.ExceptionErrorModel).to(ExceptionError);
  bind<UserControllerModel>(TYPES.UserController).to(UserController);
  bind<App>(TYPES.Application).to(App);
});

const init = () => {
  const appContainer = new Container();
  appContainer.load(appBindings);
  const app = appContainer.get<App>(TYPES.Application);

  app.init();

  return { app, appContainer };
};

export const { app, appContainer } = init();
