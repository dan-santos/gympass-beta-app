import { ICheckInsRepository } from '@/repositories/checkins-repository';
import { IGymsRepository } from '@/repositories/gyms-repository';
import { Checkin } from '@prisma/client';
import { ResourceNotFoundError } from './errors/common';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';
import { MaxDistanceError, MaxNumberOfCheckInsError } from './errors/checkin';

interface CheckInUseCaseDto {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: Checkin;
}

export class CheckInUseCase {
  constructor(
    private checkinsRepository: ICheckInsRepository,
    private gymsRepository: IGymsRepository
  ){}

  async execute({ userId, gymId, userLatitude, userLongitude }: CheckInUseCaseDto): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) throw new ResourceNotFoundError();

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
    );

    const MAX_DISTANCE_IN_KILOMETES = 0.1;

    if (distance > MAX_DISTANCE_IN_KILOMETES) {
      throw new MaxDistanceError();
    }

    const checkinOnSameDay = await this.checkinsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkinOnSameDay) {
      throw new MaxNumberOfCheckInsError();
    }
    
    const checkIn = await this.checkinsRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    return {
      checkIn,
    };
  }
}