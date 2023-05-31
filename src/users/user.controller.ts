import type { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import 'reflect-metadata';
import { BaseController } from '../common/base.controller.js';
import { HttpError } from '../errors/http-error.js';
import { LoggerServiceModel } from '../logger/logger.interface.js';
import { TYPES } from '../types/types.js';
import type { UserLoginDto } from './dto/user-login.dto.js';
import type { UserRegisterDto } from './dto/user-register.dto.js';
import type { UserControllerModel } from './user.interface.js';
import { loginValidators, registerValidators } from './user.validator.js';
import { UsersServiceModel } from './usersService.interface.js';

@injectable()
export class UserController extends BaseController implements UserControllerModel {
  constructor(
    @inject(TYPES.LoggerServiceModel) protected logger: LoggerServiceModel,
    @inject(TYPES.UsersService) private readonly usersService: UsersServiceModel,
  ) {
    super(logger);
    this.bindRoutes([
      { path: '/register', method: 'post', func: this.register, middlewares: registerValidators },
      { path: '/login', method: 'post', func: this.login, middlewares: loginValidators },
    ]);
  }

  async login({ body }: Request<unknown, unknown, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
    const result = await this.usersService.validateUser(body);

    if (result) {
      this.ok(res, { message: 'Login success' });
    } else {
      next(new HttpError(401, 'Wrong email or password'));
    }
  }

  async register(
    { body }: Request<unknown, unknown, UserRegisterDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.usersService.createUser(body);

    if (result) {
      const { email, id } = result;
      this.ok(res, { email, id });
    } else {
      next(new HttpError(422, 'User already exists'));
    }
  }
}
