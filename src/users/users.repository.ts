import type { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { PrismaService } from '../database/prisma.service.js';
import { TYPES } from '../types/types.js';
import type { User } from './user.entity.js';
import type { UsersRepositoryModel } from './usersRepository.interface.js';

@injectable()
export class UsersRepository implements UsersRepositoryModel {
  readonly #client: typeof this.prismaService.client.userModel;
  constructor(@inject(TYPES.PrismaService) private readonly prismaService: PrismaService) {
    this.#client = this.prismaService.client.userModel;
  }

  create({ email, password, name }: User): Promise<UserModel> {
    return this.#client.create({
      data: { email, password, name },
    });
  }

  find(email: string): Promise<UserModel | null> {
    return this.#client.findFirst({
      where: { email },
    });
  }
}
