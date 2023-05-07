import { App } from './app';
import { ExceptionError } from './errors/exception.error';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/user.controller';

(async () => {
  const logger = new LoggerService();
  const app = new App(logger, new UserController(logger), new ExceptionError(logger));

  await app.init();
})();
