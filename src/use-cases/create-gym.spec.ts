import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { describe, it, expect, beforeAll } from 'vitest';
import { CreateGymUseCase } from './create-gym';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create gym tests', () => {
  beforeAll(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      name: 'Gym',
      description: 'About gym',
      phone: '123-456',
      latitude: 0,
      longitude: 0
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});