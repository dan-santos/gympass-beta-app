import { IGymsRepository } from '@/repositories/gyms-repository';
import { Gym } from '@prisma/client';

interface CreateGymUseCaseDto {
  name: string;
  description: string | null;
  phone:  string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymUseCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(
    private gymsRepository: IGymsRepository,
  ){}

  async execute({ 
    name, 
    description, 
    phone, 
    latitude, 
    longitude 
  }: CreateGymUseCaseDto): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      name, 
      description, 
      phone, 
      latitude, 
      longitude 
    });

    return {
      gym,
    };
  }
}

