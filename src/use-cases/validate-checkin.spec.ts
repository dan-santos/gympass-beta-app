import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { ValidateCheckInUseCase } from './validate-checkin';
import { ResourceNotFoundError } from './errors/common';
import { LateCheckInValitadionError } from './errors/checkin';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe('validate check-ins tests', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository;
    sut = new ValidateCheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-1',
      user_id: 'user-1',
    });

    const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
  });

  it('should NOT be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-id'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should NOT be able to validate the check-in after 20min of its creation', async () => {
    vi.setSystemTime(new Date(2023, 9, 10, 13, 40));

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-1',
      user_id: 'user-1',
    });

    const MAX_TIME_OF_VALIDATION_OF_CHECKIN = 1000 * 60 * 21; // 20m + 1m
    vi.advanceTimersByTime(MAX_TIME_OF_VALIDATION_OF_CHECKIN);

    await expect(() =>
      sut.execute({ 
        checkInId: createdCheckIn.id 
      })
    ).rejects.toBeInstanceOf(LateCheckInValitadionError);
  });
});