import type { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { ConfigServiceModel } from '../config/configService.interface.js';
import { TYPES } from '../types/types.js';
import type { UserLoginDto } from './dto/user-login.dto.js';
import type { UserRegisterDto } from './dto/user-register.dto.js';
import { User } from './user.entity.js';
import { UsersRepositoryModel } from './usersRepository.interface.js';
import type { UsersServiceModel } from './usersService.interface.js';

@injectable()
export class UsersService implements UsersServiceModel {
  constructor(
    @inject(TYPES.ConfigService) private readonly configService: ConfigServiceModel,
    @inject(TYPES.UsersRepository) private readonly usersRepository: UsersRepositoryModel,
  ) {}
  async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
    const newUser = new User(email, name);
    const salt = this.configService.get('SALT');
    await newUser.setPassword(password, Number(salt));

    const isExists = await this.usersRepository.find(email);

    return isExists ? null : this.usersRepository.create(newUser);
  }

  async validateUser({ password, email }: UserLoginDto): Promise<boolean> {
    return await this.usersRepository.find(email).then((user) => {
      if (!user) return false;

      return new User(user.email, user.name as string, user.password).comparePassword(password);
    });
  }
}
