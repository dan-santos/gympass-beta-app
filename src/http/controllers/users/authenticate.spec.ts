import { it, describe, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '@/app';

describe('[e2e] Authenticate', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to register user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Joao',
        email: 'j@mail.com',
        password: '123456'
      });

    const response = await request(app.server)
      .post('/sessions')
      .send({
        email: 'j@mail.com',
        password: '123456' 
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});