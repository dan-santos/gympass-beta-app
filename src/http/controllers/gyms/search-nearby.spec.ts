import { it, describe, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user';

describe('[e2e] Search Nearby Gyms', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to search nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Gym 1',
        description: 'Gym 1 description',
        phone: '123-456',
        latitude: 0,
        longitude: 0,
      });
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Gym 2',
        description: 'Gym 2 description',
        phone: '123-456',
        latitude: 0.02,
        longitude: 0.01,
      });
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Gym 3',
        description: 'Gym 3 description',
        phone: '123-456',
        latitude: 12,
        longitude: -20,
      });

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: 0,
        longitude: 0
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(2);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ name: 'Gym 1' }),
      expect.objectContaining({ name: 'Gym 2' }),
    ]);
  });
});