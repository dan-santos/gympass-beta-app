import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/user';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate user tests', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'Joao',
      email: 'joao@mail.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      email: 'joao@mail.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should NOT be able to authenticate with wrong email', async () => {
    await expect(() => sut.execute({
      email: 'joao@mail.com',
      password: '123456',
    })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should NOT be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'Joao',
      email: 'joao@mail.com',
      password_hash: await hash('123456', 6),
    });

    await expect(() => sut.execute({
      email: 'joao@mail.com',
      password: '1234567',
    })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});