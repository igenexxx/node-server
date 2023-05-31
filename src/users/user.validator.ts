import type { MiddlewareModel } from '../common/middleware.interface.js';
import { ValidateMiddleware } from '../common/validate.middleware.js';
import { UserLoginDto } from './dto/user-login.dto.js';
import { UserRegisterDto } from './dto/user-register.dto.js';

export const registerValidators: MiddlewareModel[] = [new ValidateMiddleware(UserRegisterDto)];
export const loginValidators: MiddlewareModel[] = [new ValidateMiddleware(UserLoginDto)];
