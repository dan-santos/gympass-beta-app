import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { GetUserMetricsUseCase } from './get-user-metrics';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe('get user metrics tests', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository;
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it('should be able to get metrics of user', async () => {
    const numberOfCheckins = 5;

    for (let index = 0; index < numberOfCheckins; index++) {
      await checkInsRepository.create({
        user_id: 'user-1',
        gym_id: `gym-${index}`
      });
    }

    const { checkInsCount } = await sut.execute({ userId: 'user-1' });

    expect(checkInsCount).toEqual(numberOfCheckins);
  });
});