import { makeCheckInUseCase } from '@/use-cases/factories/make-checkin-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function create(req: FastifyRequest, res: FastifyReply) {
  const createCheckInParamsDto = z.object({
    gymId: z.string().uuid(),
  });

  const createCheckInDto = z.object({
    latitude: z.number().refine(value => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine(value => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } 
    = createCheckInDto.parse(req.body);
  const { gymId } = createCheckInParamsDto.parse(req.params);

  const checkInUseCase = makeCheckInUseCase();

  const { checkIn } = await checkInUseCase.execute(
    { userLatitude: latitude, userLongitude: longitude, gymId, userId: req.user.sub } 
  );

  return res.status(201).send({
    checkIn,
  });
}