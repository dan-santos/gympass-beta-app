import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { CheckInUseCase } from './checkin';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { MaxDistanceError, MaxNumberOfCheckInsError } from './errors/checkin';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('check-ins tests', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository;
    gymsRepository = new InMemoryGymsRepository;
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-1',
      name: 'Gym 1',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to create check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: 0,
      userLongitude: 0
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should NOT be able to create check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 9, 10, 9, 0, 0));

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: 0,
      userLongitude: 0
    });

    await expect(() => sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: 0,
      userLongitude: 0
    })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('should be able to create check in twice in the different days', async () => {
    vi.setSystemTime(new Date(2023, 9, 10, 9, 0, 0));
    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: 0,
      userLongitude: 0
    });

    vi.setSystemTime(new Date(2023, 9, 11, 9, 0, 0));
    const checkin = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: 0,
      userLongitude: 0
    });

    expect(checkin).toBeTruthy();
  });

  it('should NOT be able to create check in on distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-2',
      name: 'Gym 2',
      description: '',
      phone: '',
      latitude: -23.4848464,
      longitude: -46.6995227
    });

    await expect(() => sut.execute({
      userId: 'user-1',
      gymId: 'gym-2',
      userLatitude: 0,
      userLongitude: 0
    })).rejects.toBeInstanceOf(MaxDistanceError);
  });
});