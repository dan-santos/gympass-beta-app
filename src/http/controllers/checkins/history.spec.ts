import { it, describe, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('[e2e] Create CheckIn', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to get check-ins history of user', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        name: 'Gym 1',
        latitude: 0,
        longitude: 0,
      },
    });

    await prisma.checkin.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ]
    });
    
    const response = await request(app.server)
      .get('/checkins/history')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id,
      }),
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id,
      }),
    ]);
  });
});