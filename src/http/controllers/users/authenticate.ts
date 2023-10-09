import { InvalidCredentialsError } from '@/use-cases/errors/user';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
  const authenticateBodyDto = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodyDto.parse(req.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const { user } = await authenticateUseCase.execute({ email, password });

    // by convention, the user ID is assigned in "sub" attribute of JWT
    const token = await res.jwtSign({}, {
      sign: {
        sub: user.id,
      },
    });

    return res.status(200).send({
      token,
    });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return res.status(400).send({ message: err.message });
    }
    throw err;
  }
}