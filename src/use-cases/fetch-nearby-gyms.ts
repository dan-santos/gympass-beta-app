import { IGymsRepository } from '@/repositories/gyms-repository';
import { Gym } from '@prisma/client';

interface FetchNearbyGymsUseCaseDto {
  userLatitude: number;
  userLongitude: number;
}

interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
  constructor(
    private gymsRepository: IGymsRepository,
  ){}

  async execute({ 
    userLatitude,
    userLongitude
  }: FetchNearbyGymsUseCaseDto): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude
    });

    return {
      gyms,
    };
  }
}

