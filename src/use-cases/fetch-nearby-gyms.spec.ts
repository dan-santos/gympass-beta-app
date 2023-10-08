import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { describe, it, expect, beforeEach } from 'vitest';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('fetch nearby gyms tests', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository;
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it('should be able to search nearby gyms', async () => {
    await gymsRepository.create({
      name: 'Gym 1',
      description: 'About gym',
      phone: '123-456',
      latitude: 0,
      longitude: 0
    });

    await gymsRepository.create({
      name: 'Gym 2',
      description: 'One more gym',
      phone: '123-456',
      latitude: 0.08,
      longitude: 0.04
    });

    await gymsRepository.create({
      name: 'Gym 3',
      description: 'Another gym',
      phone: '123-456',
      latitude: -22,
      longitude: -21
    });

    const { gyms } = await sut.execute({
      userLatitude: 0,
      userLongitude: 0
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'Gym 1' }),
      expect.objectContaining({ name: 'Gym 2' }),
    ]);
  });
});