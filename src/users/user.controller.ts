import type { Request, Response } from 'express';

import { BaseController } from '../common/base.controller';
import type { LoggerService } from '../logger/logger.service';

export class UserController extends BaseController {
  constructor(protected logger: LoggerService) {
    super(logger);
    this.bindRoutes([
      { path: '/register', method: 'post', func: this.register },
      { path: '/login', method: 'post', func: this.login },
    ]);
  }

  login(_: Request, res: Response) {
    this.ok(res, { message: 'login' });
  }

  register(_: Request, res: Response) {
    this.ok(res, { message: 'register' });
  }
}
