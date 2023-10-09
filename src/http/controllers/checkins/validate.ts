import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-checkin-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function validate(req: FastifyRequest, res: FastifyReply) {
  const validateCheckInParamsDto = z.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = validateCheckInParamsDto.parse(req.params);

  const validateCheckInUseCase = makeValidateCheckInUseCase();

  await validateCheckInUseCase.execute({ checkInId });

  return res.status(204).send();
}