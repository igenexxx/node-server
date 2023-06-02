import type { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';
const { sign } = jwt;

import 'reflect-metadata';
import { AuthGuard } from '../common/auth.guard.js';
import { BaseController } from '../common/base.controller.js';
import { ConfigServiceModel } from '../config/configService.interface.js';
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
    @inject(TYPES.ConfigService) private readonly configService: ConfigServiceModel,
  ) {
    super(logger);
    this.bindRoutes([
      { path: '/register', method: 'post', func: this.register, middlewares: registerValidators },
      { path: '/login', method: 'post', func: this.login, middlewares: loginValidators },
      { path: '/info', method: 'get', func: this.info, middlewares: [new AuthGuard()] },
    ]);
  }

  async login({ body }: Request<unknown, unknown, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
    const result = await this.usersService.validateUser(body);

    if (result) {
      const token = await this.signJWT(body.email, this.configService.get('JWT_SECRET'));
      this.ok(res, { message: 'Login success', token });
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

  async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
    if (user) {
      const userInfo = await this.usersService.getUserInfo(user);
      this.ok(res, { email: userInfo?.email, name: userInfo?.name });
    } else {
      next(new HttpError(404, 'User not found'));
    }
  }

  private signJWT(email: string, secret: string): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(
        { email, iat: Math.floor(Date.now() / 1000) },
        secret,
        {
          expiresIn: '1h',
          algorithm: 'HS256',
        },
        (err, token) => {
          if (err) {
            reject(err);
          }

          resolve(token as string);
        },
      );
    });
  }
}
