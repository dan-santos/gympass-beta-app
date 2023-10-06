import fastify from 'fastify';
import { appRoutes } from './http/routes';
import { ZodError } from 'zod';
import { env } from './env';

export const app = fastify();

app.register(appRoutes);

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