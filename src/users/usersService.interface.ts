import type { UserModel } from '@prisma/client';

import type { UserLoginDto } from './dto/user-login.dto.js';
import type { UserRegisterDto } from './dto/user-register.dto.js';

export interface UsersServiceModel {
  createUser(dto: UserRegisterDto): Promise<UserModel | null>;
  validateUser(dto: UserLoginDto): Promise<boolean>;
  getUserInfo(email: string): Promise<UserModel | null>;
}
