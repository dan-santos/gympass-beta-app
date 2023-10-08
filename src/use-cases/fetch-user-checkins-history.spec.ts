import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-checkins-history';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsHistoryUseCase;

describe('fetch check-ins history tests', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository;
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository);

  });

  it('should be able to fetch check in history of user', async () => {
    await checkInsRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-1'
    });
    await checkInsRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-2'
    });

    const { checkIns } = await sut.execute({ userId: 'user-1', page: 1 });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-1' }),
      expect.objectContaining({ gym_id: 'gym-2' }),
    ]);
  });

  it('should be able to fetch paginated check in history of user', async () => {
    
    for (let index = 0; index < 22; index++) {
      await checkInsRepository.create({
        user_id: 'user-1',
        gym_id: `gym-${index}`
      });
    }

    const { checkIns } = await sut.execute({ userId: 'user-1', page: 2 });

    expect(checkIns).toHaveLength(2);
  });
});