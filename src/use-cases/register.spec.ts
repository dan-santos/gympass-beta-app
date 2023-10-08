import { expect, describe, it, beforeEach } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('register user tests', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it('should be able to register new user', async () => {
    const { user } = await sut.execute({
      name: 'Jon Doe', email: 'jon@mail.com', password: '123456' 
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'Jon Doe', email: 'jon@mail.com', password: '123456' 
    });

    const isPasswordCorrectlyHashed = await compare('123456', user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should NOT be able to register users with same email twice', async () => {
    await sut.execute({
      name: 'Jon Doe', email: 'jon@mail.com', password: '123456' 
    });

    await expect(() => sut.execute({
      name: 'Jon Doe', email: 'jon@mail.com', password: '123456' 
    })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});