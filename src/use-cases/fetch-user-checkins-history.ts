import { ICheckInsRepository } from '@/repositories/checkins-repository';
import { Checkin } from '@prisma/client';

interface FetchUserCheckInsHistoryUseCaseDto {
  userId: string;
  page?: number;
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  checkIns: Checkin[];
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(
    private checkinsRepository: ICheckInsRepository,
  ){}

  async execute(
    { userId, page }: FetchUserCheckInsHistoryUseCaseDto
  ): Promise<FetchUserCheckInsHistoryUseCaseResponse>{
    
    const desiredPage = page ?? 1;
    const checkIns = await this.checkinsRepository.findManyByUserId(userId, desiredPage);

    return {
      checkIns,
    };
  }
}