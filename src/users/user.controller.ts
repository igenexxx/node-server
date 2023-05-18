import type { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import 'reflect-metadata';
import { BaseController } from '../common/base.controller.js';
import { HttpError } from '../errors/http-error.js';
import { LoggerServiceModel } from '../logger/logger.interface.js';
import { TYPES } from '../types/types.js';
import type { UserControllerModel } from './user.interface.js';

@injectable()
export class UserController extends BaseController implements UserControllerModel {
  constructor(@inject(TYPES.LoggerServiceModel) protected logger: LoggerServiceModel) {
    super(logger);
    this.bindRoutes([
      { path: '/register', method: 'post', func: this.register },
      { path: '/login', method: 'post', func: this.login },
    ]);
  }

  login(_: Request, res: Response, next: NextFunction) {
    next(new HttpError(401, 'Unauthorized', 'Login failed'));
    // this.ok(res, { message: 'login' });
  }

  register(_: Request, res: Response) {
    this.ok(res, { message: 'register' });
  }
}
