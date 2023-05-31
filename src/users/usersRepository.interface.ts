import type { UserModel } from '@prisma/client';

import type { User } from './user.entity.js';

export interface UsersRepositoryModel {
  create(user: User): Promise<UserModel>;
  find(email: string): Promise<UserModel | null>;
}
