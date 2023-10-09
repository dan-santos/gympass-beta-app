import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { FastifyInstance } from 'fastify';
import { create } from './create';
import { validate } from './validate';
import { history } from './history';
import { metrics } from './metrics';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';

export async function checkInRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT);

  app.post('/gyms/:gymId/checkin', create);
  app.patch('/checkins/:checkInId/validate', { onRequest: [verifyUserRole('ADMIN')] }, validate);
  app.get('/checkins/history', history);
  app.get('/checkins/metrics', metrics);
}