import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function nearby(req: FastifyRequest, res: FastifyReply) {
  const searchNearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine(value => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine(value => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = searchNearbyGymsQuerySchema.parse(req.query);

  const searchNearbyGymsUseCase = makeFetchNearbyGymsUseCase();

  const { gyms } = await searchNearbyGymsUseCase.execute(
    { userLatitude: latitude, userLongitude: longitude }
  );

  return res.status(200).send({
    gyms,
  });
}