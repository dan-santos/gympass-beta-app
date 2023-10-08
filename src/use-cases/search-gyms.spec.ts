import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { describe, it, expect, beforeEach } from 'vitest';
import { SearchGymsUseCase } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('search gyms tests', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository;
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it('should be able to search gyms that matches with given name', async () => {
    await gymsRepository.create({
      name: 'Gym 1',
      description: 'About gym',
      phone: '123-456',
      latitude: 0,
      longitude: 0
    });

    await gymsRepository.create({
      name: 'Gym 2',
      description: 'About gym',
      phone: '123-456',
      latitude: 0,
      longitude: 0
    });

    const { gyms } = await sut.execute({
      query: 'Gym',
      page: 1
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'Gym 1' }),
      expect.objectContaining({ name: 'Gym 2' }),
    ]);
  });

  it('should be able to fetch paginated gyms search', async () => {
    
    for (let index = 0; index < 22; index++) {
      await gymsRepository.create({
        name: `Gym ${index}`,
        description: 'About gym',
        phone: '123-456',
        latitude: 0,
        longitude: 0
      });
    }

    const { gyms } = await sut.execute({
      query: 'Gym',
      page: 2
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'Gym 20' }),
      expect.objectContaining({ name: 'Gym 21' }),
    ]);
  });
});