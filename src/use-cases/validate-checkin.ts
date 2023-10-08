import { ICheckInsRepository } from '@/repositories/checkins-repository';
import { Checkin } from '@prisma/client';
import { ResourceNotFoundError } from './errors/common';
import dayjs from 'dayjs';
import { LateCheckInValitadionError } from './errors/checkin';

interface ValidateCheckInUseCaseDto {
  checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
  checkIn: Checkin;
}

export class ValidateCheckInUseCase {
  constructor(
    private checkinsRepository: ICheckInsRepository,
  ){}

  async execute({ checkInId }: ValidateCheckInUseCaseDto): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkinsRepository.findById(checkInId);

    if (!checkIn) throw new ResourceNotFoundError();

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    );

    const MAX_TIME_OF_VALIDATION_OF_CHECKIN = 20;
    if (distanceInMinutesFromCheckInCreation > MAX_TIME_OF_VALIDATION_OF_CHECKIN) {
      throw new LateCheckInValitadionError();
    }

    checkIn.validated_at = new Date();

    await this.checkinsRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}