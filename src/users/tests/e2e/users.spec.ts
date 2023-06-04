import request from 'supertest';

import type { App } from '../../../app.js';
import { boot } from '../../../main.js';
import type { UserRegisterDto } from '../../dto/user-register.dto.js';

let application: App;

beforeAll(async () => {
  const { app } = await boot;
  application = app;
});

afterAll(() => {
  application.close();
});

describe('UsersController (e2e)', () => {
  describe('POST /users/register', () => {
    it('should return a new user', async () => {
      const userRegisterDto: UserRegisterDto = { name: 'John Doe', email: 'test@example.com', password: 'password' };
      const response = await request(application.app).post('/users/register').send(userRegisterDto);

      expect(response.status).toBe(200);
    });

    it('should not return a new user if name is missing', async () => {
      const userRegisterDto: Omit<UserRegisterDto, 'name'> = { email: '', password: '' };
      const response = await request(application.app).post('/users/register').send(userRegisterDto);

      expect(response.status).toBe(422);
    });
  });
});
