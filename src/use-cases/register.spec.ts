import { expect, describe, it } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user';

describe('register user tests', () => {
  it('should be able to register new user', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUserCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUserCase.execute({
      name: 'Jon Doe', email: 'jon@mail.com', password: '123456' 
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUserCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUserCase.execute({
      name: 'Jon Doe', email: 'jon@mail.com', password: '123456' 
    });

    const isPasswordCorrectlyHashed = await compare('123456', user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should NOT be able to register users with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUserCase = new RegisterUseCase(usersRepository);

    await registerUserCase.execute({
      name: 'Jon Doe', email: 'jon@mail.com', password: '123456' 
    });

    await expect(() => {
      return registerUserCase.execute({
        name: 'Jon Doe', email: 'jon@mail.com', password: '123456' 
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});