import { IGymsRepository } from '@/repositories/gyms-repository';
import { Gym } from '@prisma/client';

interface SearchGymsUseCaseDto {
  query: string;
  page?: number;
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(
    private gymsRepository: IGymsRepository,
  ){}

  async execute({ 
    query,
    page
  }: SearchGymsUseCaseDto): Promise<SearchGymsUseCaseResponse> {
    const desiredPage = page ?? 1;

    const gyms = await this.gymsRepository.searchMany(query, desiredPage);

    return {
      gyms,
    };
  }
}

