import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { GetUserProfileUseCase } from './get-user-profile';
import { describe, it, expect, beforeEach } from 'vitest';
import { hash } from 'bcryptjs';
import { ResourceNotFoundError } from './errors/common';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('get user profile tests', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it('should return user profile data', async () => {
    const createdUser = await usersRepository.create(
      {
        name: 'Jon Doe',
        email: 'jon@mail.com',
        password_hash: await hash('123456', 6), 
      }
    );

    const { user } = await sut.execute({ userId: createdUser.id });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should NOT return user profile data with wrong userId', async () => {
    await expect(() => 
      sut.execute({ userId: 'not-existing-id' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});