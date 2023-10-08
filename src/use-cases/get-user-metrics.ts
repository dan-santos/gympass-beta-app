import { ICheckInsRepository } from '@/repositories/checkins-repository';

interface GetUserMetricsUseCaseDto {
  userId: string;
}

interface GetUserMetricsUseCaseResponse {
  checkInsCount: number;
}

export class GetUserMetricsUseCase {
  constructor(
    private checkinsRepository: ICheckInsRepository,
  ){}

  async execute(
    { userId }: GetUserMetricsUseCaseDto
  ): Promise<GetUserMetricsUseCaseResponse>{
    
    const checkInsCount = await this.checkinsRepository.countByUserId(userId);

    return {
      checkInsCount,
    };
  }
}