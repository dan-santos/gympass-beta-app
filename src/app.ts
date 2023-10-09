import fastify from 'fastify';
import { ZodError } from 'zod';
import { env } from './env';
import { fastifyJwt } from '@fastify/jwt';
import { usersRoutes } from './http/controllers/users/routes';
import { gymsRoutes } from './http/controllers/gyms/routes';
import { checkInRoutes } from './http/controllers/checkins/routes';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});
app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInRoutes);

app.setErrorHandler((err, _, res) => {
  if (err instanceof ZodError) {
    return res.status(400).send(
      { message: 'Validation error', issues: err.format() }
    );
  }

  if (env.NODE_ENV !== 'prd') {
    console.error(err);
  } else {
    // TODO: Here we should log to external tool like NewRelic or Sentry
  }

  return res.status(500).send({ message: 'Internal Server Error' });
});