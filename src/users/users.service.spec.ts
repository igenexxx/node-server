import type { UserModel } from '@prisma/client';
import { Container } from 'inversify';

import 'reflect-metadata';
import type { ConfigServiceModel } from '../config/configService.interface.js';
import { TYPES } from '../types/types.js';
import type { UserRegisterDto } from './dto/user-register.dto.js';
import { User } from './user.entity.js';
import { UsersService } from './users.service.js';
import type { UsersRepositoryModel } from './usersRepository.interface.js';
import type { UsersServiceModel } from './usersService.interface.js';

const configServiceModel: ConfigServiceModel = {
  get: jest.fn(),
};

const usersRepositoryMock: UsersRepositoryModel = {
  create: jest.fn(),
  find: jest.fn(),
};

let usersService: UsersServiceModel;
let usersRepository: UsersRepositoryModel;
let configService: ConfigServiceModel;

const container = new Container();

describe('UsersService', () => {
  beforeAll(() => {
    container.bind<UsersServiceModel>(TYPES.UsersService).to(UsersService);
    container.bind<ConfigServiceModel>(TYPES.ConfigService).toConstantValue(configServiceModel);
    container.bind<UsersRepositoryModel>(TYPES.UsersRepository).toConstantValue(usersRepositoryMock);

    configService = container.get<ConfigServiceModel>(TYPES.ConfigService);
    usersRepository = container.get<UsersRepositoryModel>(TYPES.UsersRepository);
    usersService = container.get<UsersServiceModel>(TYPES.UsersService);
  });

  describe('createUser', () => {
    it('should create a new user if the email is not already in use', async () => {
      const email = 'test@example.com';
      const name = 'Test User';
      const password = 'password';
      const salt = '10';
      const userRegisterDto: UserRegisterDto = { email, name, password };
      usersRepository.find = jest.fn().mockResolvedValue(null);
      configService.get = jest.fn().mockReturnValue(salt);
      usersRepository.create = jest.fn().mockImplementationOnce(
        (user: User): UserModel => ({
          name: user.name,
          email: user.email,
          password: user.password,
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );

      const result = await usersService.createUser(userRegisterDto);

      expect(result?.password).not.toBe(password);
      expect(usersRepository.find).toHaveBeenCalledWith(email);
      expect(configService.get).toHaveBeenCalledWith('SALT');
      expect(usersRepository.create).toHaveBeenCalledWith(expect.any(User));
    });

    it('should return null if the email is already in use', async () => {
      const email = 'test@example.com';
      const name = 'Test User';
      const password = 'password';
      const userRegisterDto: UserRegisterDto = { email, name, password };
      const existingUser: UserModel = {
        id: 1,
        email,
        name: 'Existing User',
        password: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      usersRepository.find = jest.fn().mockResolvedValue(existingUser);

      const result = await usersService.createUser(userRegisterDto);

      expect(result).toBeNull();
      expect(usersRepository.find).toHaveBeenCalledWith(email);
      expect(usersRepository.create).toHaveBeenCalled();
    });
  });
});
