import bcrypt from 'bcryptjs';

const { hash } = bcrypt;

export class User {
  #password: string;
  constructor(
    private readonly _email: string,
    private readonly _name: string,
    private readonly hashedPassword?: string,
  ) {
    this.#password = hashedPassword || '';
  }

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get password(): string {
    return this.#password;
  }

  async setPassword(password: string, salt = 12): Promise<User> {
    this.#password = await hash(password, salt);

    return this;
  }

  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
